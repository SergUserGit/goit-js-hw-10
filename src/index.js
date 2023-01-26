import './css/styles.css';
import { fetchCountries } from './fetchCountries';

import Notiflix from 'notiflix';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Block } from 'notiflix/build/notiflix-block-aio';

Notiflix.Notify.init({
  width: '280px',
  position: 'left-top',
  distance: '70px',
  opacity: 1,
});

const DEBOUNCE_DELAY = 300;

const debounce = require('lodash.debounce');

const elCountryList = document.querySelector('.country-list');
const elCountryInfo = document.querySelector('.country-info');

const elementSearchBox = document.querySelector('#search-box');
elementSearchBox.addEventListener(
  'input',
  debounce(onSearchBoxInput, DEBOUNCE_DELAY)
);

function onSearchBoxInput(evt) {
  clearMarkup();

  const inputValue = evt.target.value.trim();
  if (inputValue === '') {
    return;
  }
  const countriesArray = fetchCountries(inputValue);

  countriesArray.then(displayData).catch(error => {});
}

function getMarkupListCountries(countryName, flagSvgRef) {
  const strMarkup =
    '<li class="country-item"><img src="' +
    flagSvgRef +
    '" alt="' +
    countryName +
    '" width="70" height="40"><p class="contry-name">' +
    countryName +
    '</p></li>';
  return strMarkup;
}

function getMarkupCountryInfo(dataObject) {
  const {
    population: Population,
    capital,
    name: { official: countryName },
    flags: { svg: flagSvgRef },
    languages,
  } = dataObject;

  const Capital = capital.join(', ');
  const Languages = Object.values(languages).join(', ');

  const strMarkup =
    '<div class="country-info-img"><img class="img-country" src="' +
    flagSvgRef +
    '" alt="' +
    countryName +
    '" width="70" height="40"><p class="country-text">' +
    countryName +
    '</p></div><ul class="info-list"><li class="info-item"><span class="info-span">Capital: </span><p class="info-text">' +
    Capital +
    '</p></li><li class="info-item"><span class="info-span">Population: </span><p class="info-text">' +
    Population +
    '</p></li><li class="info-item"><span class="info-span">Languages: </span><p class="info-text">' +
    Languages +
    '</p></li></ul>';
  return strMarkup;
}

function clearMarkup() {
  elCountryList.innerHTML = '';
  elCountryInfo.innerHTML = '';
}

function displayErrorMessage(messageText) {
  Notiflix.Notify.failure(messageText);
}

function displayInfoMessage(messageText) {
  Notiflix.Notify.info(messageText);
}

function getSortArray(firstArray) {
  return [...firstArray].sort((a, b) =>
    a.name.official.localeCompare(b.name.official)
  );
}

function getMurkupCountries(countryArray) {
  const markupArray = getArrayMurkupCountries(countryArray);
  return markupArray.join('');
}

function getArrayMurkupCountries(countryArray) {
  return countryArray.map(el => {
    return getMarkupListCountries(el.name.official, el.flags.svg);
  });
}

function displayListCountries(data) {
  const arrayCountrySort = getSortArray(data);
  const murkupCountries = getMurkupCountries(arrayCountrySort);
  elCountryList.insertAdjacentHTML('afterbegin', murkupCountries);
}

function displayInfoCountries(data) {
  const murkupCountryInfo = getMarkupCountryInfo(data[0]);
  elCountryInfo.insertAdjacentHTML('afterbegin', murkupCountryInfo);
}

function displayData(data) {
  if (data.status === 404) {
    displayErrorMessage('Oops, there is no country with that name');
    return;
  } else {
    if (data.length > 10) {
      displayInfoMessage(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (data.length >= 2 && data.length <= 10) {
      displayListCountries(data);
    } else if (data.length === 1) {
      displayInfoCountries(data);
    }
  }
}
