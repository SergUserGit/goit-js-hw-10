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
  elCountryList.innerHTML = '';
  elCountryInfo.innerHTML = '';

  const countriesArray = fetchCountries(evt.target.value.trim());
  // console.log('status', countriesArray);
  countriesArray
    .then(data => {
      if (data.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return;
      } else {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          const ArrayCountrySort = [...data].sort((a, b) =>
            a.name.official.localeCompare(b.name.official)
          );

          const markupArray = ArrayCountrySort.map(el => {
            return getMarkupListCountries(el.name.official, el.flags.svg);
          });

          const murkupCountries = markupArray.join('');

          elCountryList.insertAdjacentHTML('afterbegin', murkupCountries);
        } else if (data.length === 1) {
          const murkupCountryInfo = getMarkupCountryInfo(
            data[0].name.official,
            data[0].flags.svg,
            data[0].capital.join(', '),
            data[0].population,
            Object.values(data[0].languages).join(', ')
          );
          elCountryInfo.insertAdjacentHTML('afterbegin', murkupCountryInfo);
        }
      }
    })
    .catch(error => {});
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

function getMarkupCountryInfo(
  countryName,
  flagSvgRef,
  Capital,
  Population,
  Languages
) {
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
