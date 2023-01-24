const URL_COUNTRIES = 'https://restcountries.com/v3.1/name/';

export const fetchCountries = name => {
  return fetch(URL_COUNTRIES + '{' + name + '}');
};
