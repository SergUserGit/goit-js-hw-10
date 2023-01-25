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
  countriesArray
    .then(data => {
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
        //   console.log(data[0].name.official);
        //   const strCapitals = data[0].capital.join(',');
        //   console.log(strCapitals);
        //   console.log(data[0].population);
        //   console.log(data[0].flags.svg);
        console.log(Object.values(data[0].languages).join(','));
      }
    })
    .catch(error => {
      console.log('Ошибка', error);
    });
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

function getMarkupCountryInfo() {}
