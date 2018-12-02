import _ from "lodash";
import config from "../config";
import { Rental } from "../models/Rental";
import { Movie } from "../models/Movie";
import { Serie } from "../models/Serie";
import { User } from "../models/User";
const stripe = require("stripe")(config.stripeKeySecret);

export const storeRent = async (req, res) => {
  const { userId, moviesId, seriesId } = req.body;

  const user = await User.findById(userId);
  const movies = await Movie.find({
    $and: [{ _id: { $in: moviesId } }, { stock: { $gt: 0 } }]
  });
  const series = await Serie.find({
    $and: [{ _id: { $in: seriesId } }, { stock: { $gt: 0 } }]
  });

  if (!user || (movies.length <= 0 && series.length <= 0)) {
    return res
      .status(404)
      .send("Seems something is missing or products are out of stock");
  }

  if (user.balance <= 0) {
    return res.status(403).send("Sorry seems your balance isn't enough");
  }

  const rental = new Rental({ customer: userId });

  return rental
    .save()
    .then(rent => {
      Rental.findByIdAndUpdate(
        rent._id,
        { $push: { movies: { $each: moviesId }, series: { $each: seriesId } } },
        { new: true }
      ).exec((err, rent) => {
        if (err) {
          return res.status(503).json(err);
        }

        rent.movies.map(movie => {
          Movie.update({ _id: movie._id }, { $inc: { stock: -1 } }, err => {
            if (err) {
              return res.status(503).send("Error updating movie.");
            }
          });
        });
        rent.series.map(serie => {
          Serie.update({ _id: serie._id }, { $inc: { stock: -1 } }, err => {
            if (err) {
              return res.status(503).send("Error updating serie.");
            }
          });
        });

        res.json(rent);
      });
    })
    .catch(() => res.status(503).send("Error saving your renting."));
};

export const returnRent = async (req, res) => {
  const { rentId, id } = req.body;
  const rental = await Rental.findById(rentId)
    .populate("customer")
    .populate("movies")
    .populate("series");

  if (!rental) {
    return res.status(404).send("No rental found");
  }

  if (rental.dateReturned) {
    return res
      .status(503)
      .send(`Order with ID: ${rental._id} has already been returned`);
  }

  rental.returnRental(rental.movies, rental.series);

  if (
    rental.rentalFee > rental.customer.balance ||
    rental.customer.balance <= 0 ||
    rental.customer.balance < rental.returnRental(rental.movies, rental.series)
  ) {
    return res
      .status(503)
      .send(
        `Dear/Madam, ${
          rental.customer.username
        } your balance isn't enough to return your order`
      );
  }

  await stripe.charges.create({
    amount: Math.round(rental.rentalFee) * 100,
    currency: "EUR",
    description: `Return fee of ${Math.round(rental.rentalFee) * 100}`,
    source: id
  });

  return rental
    .save()
    .then(rent => {
      rent.movies.map(movie => {
        Movie.update({ _id: movie._id }, { $inc: { stock: 1 } }, err => {
          if (err) {
            return res.status(503).send("Error updating movie.");
          }
        });
      });
      rent.series.map(serie => {
        Serie.update({ _id: serie._id }, { $inc: { stock: 1 } }, err => {
          if (err) {
            return res.status(503).send("Error updating serie.");
          }
        });
      });

      User.update(
        { _id: rent.customer._id },
        { $inc: { balance: -rent.rentalFee } },
        err => {
          if (err) {
            return res.status(503).send("Error updating user.");
          }
        }
      );

      res.json(rent);
    })
    .catch(() => res.status(503).send("Error saving your order return."));
};

export const getAllRents = (req, res) => {
  return Rental.find({})
    .populate("customer")
    .populate("movies")
    .populate("series")
    .exec((err, data) => {
      if (err) throw err;
      res.json(data);
    });
};

export const getRentById = (req, res) => {
  return Rental.findById(req.params.id)
    .populate("customer")
    .populate("movies")
    .populate("series")
    .exec((err, data) => {
      if (err) throw err;
      res.json(data);
    });
};

export const getRentByUser = (req, res) => {
  return Rental.find({ customer: req.params.id })
    .populate("customer")
    .populate("movies")
    .populate("series")
    .exec((err, data) => {
      if (err) throw err;
      res.json(data);
    });
};
