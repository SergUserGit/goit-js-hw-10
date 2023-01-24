const URL_COUNTRIES = 'https://restcountries.com/v3.1/name/';
const FILTER_STRING = '?fields=population,capital,languages,name,flags';

export const fetchCountries = name => {
  return fetch(URL_COUNTRIES + name + FILTER_STRING).then(response => {
    return response.json();
  });
};
