import _ from "lodash";

export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const compareData = (existingData, newData) =>
  !(
    newData.Title !== existingData.title ||
    !_.isEqual(existingData.genre, newData.Genre) ||
    !_.isEqual(existingData.writer, newData.Writer) ||
    !_.isEqual(existingData.rating, newData.imdbRating) ||
    newData.Poster !== existingData.poster ||
    newData.Plot !== existingData.plot
  );
