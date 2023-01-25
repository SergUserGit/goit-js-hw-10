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

const elementSearchBox = document.querySelector('#search-box');
elementSearchBox.addEventListener(
  'input',
  debounce(onSearchBoxInput, DEBOUNCE_DELAY)
);

function onSearchBoxInput(evt) {
  const countriesArray = fetchCountries(evt.target.value);
  console.log(countriesArray);
  countriesArray
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      console.log('Ошибка', error);
    });
}
