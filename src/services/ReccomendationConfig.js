export const neuralConfig = {
    hiddenLayers: [4],
    activation: "sigmoid"
};

export const getNormalizedItemFromStock = (index, array) => {
    const item = array[index];
    const trainingInformation = item.trainingInformation;
    return {
        trainingInformation: {
            rating: trainingInformation.rating,
            genre: trainingInformation.genre,
            stock: trainingInformation.stock
        },
        id: item.id
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
        case 'Crime, Drama, Horror, Mystery, Thriller':
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
        case 'Comedy, Horror, Reality-TV':
            return 12;
        case 'Drama, Fantasy, Horror, Mystery, Sci-Fi, Thriller':
            return 13;
        case 'Comedy, Crime, Drama':
            return 14;
        case 'Crime, Drama, Mystery, Romance':
            return 15;
        case 'Drama, Fantasy, Mystery, Romance, Thriller':
            return 16;
        case 'Crime, Drama, Thriller':
            return 17;
        case 'Crime, Drama':
            return 18;
        case 'Comedy, Family':
            return 19;
        case 'Animation, Family, Fantasy, Musical':
            return 20;
        case 'Animation, Short, Comedy, Family, Fantasy, Musical':
            return 21;
        case 'Action, Adventure, Crime, Drama, Mystery, Sci-Fi':
            return 22;
        case 'Comedy, Drama':
            return 23;
        case 'Action, Adventure, Crime, Fantasy, Sci-Fi':
            return 24;
        case 'Action, Adventure, Drama':
            return 25;
        case 'Adventure, Drama, Fantasy':
            return 26;
        default:
            return 0;
    }
};

export const pushTrainingData = (data, array) => {
    return data.map(record => {
        array.push({
            trainingInformation: {
                rating: isNaN(parseFloat(record.rating)) ? 0 : parseFloat(record.rating), genre: getProductGenre(record), stock: record.stock
            },
            id: record._id
        });
    });
};
