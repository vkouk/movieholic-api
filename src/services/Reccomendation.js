import brain from "brain.js";
import {
  neuralConfig,
  getNormalizedItemFromStock,
  pushTrainingData
} from "./ReccomendationConfig";
import { Rental } from "../models/Rental";
import { Movie } from "../models/Movie";
import { Serie } from "../models/Serie";

const Reccomendation = async (req, res) => {
  const userRents = [];
  const storedMovies = [];
  const storedSeries = [];
  const { userId } = req.body;
  const rentals = await Rental.find({ customer: userId })
    .populate("movies")
    .populate("series");
  const movies = await Movie.find({});
  const series = await Serie.find({});

  rentals.map(rent => {
    if (rent.movies.length >= 1 || rent.series.length >= 1) {
      pushTrainingData(rent.movies, userRents);
      pushTrainingData(rent.series, userRents);
    }
  });
  const rentMoviesLength = rentals.reduce(
    (acc, curr) => acc + curr.movies.length,
    0
  );
  const rentSeriesLength = rentals.reduce(
    (acc, curr) => acc + curr.series.length,
    0
  );
  if (rentMoviesLength >= 1 || rentSeriesLength >= 1) {
    pushTrainingData(movies, storedMovies);
    pushTrainingData(series, storedSeries);
  }

  const trainingData = [
    {
      input: {
        rating: parseFloat(Math.random() * (0.0 - 9.9) + 9.9).toFixed(2),
        genre: 2,
        stock: 2
      },
      output: { wanted: 0 }
    }
  ];
  let product;

  if (typeof product !== "undefined") {
    trainingData.push({
      input: product.trainingInformation,
      output: { wanted: (product.rating + product.genre + product.stock) / 4 }
    });
  }

  const neural = new brain.NeuralNetwork(neuralConfig);

  neural.train(trainingData);

  const suggestedProducts = [];
  userRents.map((product, i) => {
    const item = getNormalizedItemFromStock(i, userRents);
    item.wanted = neural.run(product.trainingInformation).wanted;
    suggestedProducts.push(item);
  });
  storedMovies.map((movie, i) => {
    const item = getNormalizedItemFromStock(i, storedMovies);
    item.wanted = neural.run(movie.trainingInformation).wanted;
    suggestedProducts.push(item);
  });
  storedSeries.map((serie, i) => {
    const item = getNormalizedItemFromStock(i, storedSeries);
    item.wanted = neural.run(serie.trainingInformation).wanted;
    suggestedProducts.push(item);
  });
  suggestedProducts.sort((a, b) => b.wanted - a.wanted);

  if (!rentals || !suggestedProducts) {
    return res.status(404).send("No reccomendations found for this user");
  }

  const suggestedId = suggestedProducts
    .slice(suggestedProducts.length - 100, suggestedProducts.length)
    .map(product => product.id);
  const suggestedSeries = await Serie.find({
    _id: { $in: suggestedId }
  });
  const suggestedMovies = await Movie.find({
    _id: { $in: suggestedId }
  });

  return res.json({ suggestedMovies, suggestedSeries });
};

export default Reccomendation;
