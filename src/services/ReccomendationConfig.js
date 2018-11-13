export const neuralConfig = {
    hiddenLayers: [4],
    activation: "sigmoid"
};

export const getNormalizedItemFromStock = (index, array) => {
    const item = array[index];
    const trainingInformation = item.trainingInformation;
    return {
        trainingInformation: {
            writer: trainingInformation.writer,
            rating: trainingInformation.rating,
            genre: trainingInformation.genre,
            stock: trainingInformation.stock
        }
    };
};

export const getProductGenre = product => {
    switch (product.genre) {
        case 'Action, Adventure, Sci-Fi':
            return 0;
        case 'Comedy, Romance':
            return 1;
        case 'Animation, Action, Crime, Sci-Fi, Thriller':
            return 2;
        case 'Animation, Action, Adventure, Crime, Drama, Sci-Fi, Thriller':
            return 3;
        case 'Crime, Drama, Film-Noir, Mystery, Thriller':
            return 4;
        case 'Documentary, Family':
            return 5;
        case 'Animation, Action, Crime':
            return 6;
        case 'Crime, Drama, Film-Noir, Mystery, Thriller':
            return 7;
        case 'Animation, Family, Fantasy':
            return 8;
        case 'Action, Adventure':
            return 9;
        case 'Horror, Mystery, Thriller':
            return 10;
        case 'Animation, Action, Adventure':
            return 11;
        default:
            return 0;
    }
};
