import brain from 'brain.js';

const Reccomendation = userId => {
    const { LSTM } = brain.recurrent;
    const neural = new LSTM();

};

export default Reccomendation;