import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const debounce = require('lodash.debounce');

const elementSearchBox = document.querySelector('#search-box');
elementSearchBox.addEventListener(
  'input',
  debounce(onSearchBoxInput, DEBOUNCE_DELAY)
);

function onSearchBoxInput(evt) {
  console.log(evt.target.value);
}
