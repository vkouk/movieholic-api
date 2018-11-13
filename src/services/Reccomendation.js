import brain from "brain.js";
import { neuralConfig, getNormalizedItemFromStock, getProductGenre } from './ReccomendationConfig';
import { Rental } from "../models/Rental";

const Reccomendation = async (req, res) => {
    const userRents = [];
    const { userId } = req.body;
    const rentals = await Rental.find({ customer: userId }).populate('movies').populate('series');

    if (!rentals) {
        return res.status(404).send('No reccomendations found for this user');
    }

    rentals.map(rent => {
        if (rent.movies.length >= 1 || rent.series.length >= 1) {
            rent.movies.map(movie => {
                userRents.push({
                    trainingInformation: {
                        rating: parseFloat(movie.rating), genre: getProductGenre(movie), stock: movie.stock
                    }
                });
            });
            rent.series.map(serie => {
                userRents.push({
                    trainingInformation: {
                        rating: parseFloat(serie.rating), genre: getProductGenre(serie), stock: serie.stock
                    }
                });
            });
        }
    });

    const trainingData = [
        {
            input: {
                rating: parseFloat("4.3"), genre: 2, stock: 2
            },
            output: { wanted: 0 }
        }
    ];
    let product;

    if (typeof product !== "undefined") {
        trainingData.push({ input: product.trainingInformation, output: { wanted: (product.rating + product.genre) / 4 } });
    }

    const neural = new brain.NeuralNetwork(neuralConfig);

    neural.train(trainingData);

    const suggestedProducts = [];
    userRents.map((product, i) => {
        const item = getNormalizedItemFromStock(i, userRents);
        item.wanted = neural.run(product.trainingInformation).wanted;
        suggestedProducts.push(item);
    });
    suggestedProducts.sort((a, b) => b.wanted - a.wanted);

    res.json(suggestedProducts);
};

export default Reccomendation;
