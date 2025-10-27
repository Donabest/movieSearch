console.log('Hello');
import Swiper from 'swiper';
import * as model from './model.js';
import view from './view/view.js';
import * as helper from './helper.js';
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.min.css';

async function controlSuggestion(input) {
  try {
    await model.getMovieData(input);

    view.renderSuggestionList(model.state.search);
  } catch (err) {
    console.error(err);
  }
}

async function loadSectionUi(id, type) {
  try {
    await model.getMovieDetails(id, type);

    view.generateMarkup(model.state.details, type);
  } catch (err) {
    console.error(err);
  }
}

async function controlTrending() {
  try {
    await model.getMovieData();
    view.renderTrending(model.state.trending);
  } catch (err) {
    console.error(err);
  }
}
async function controlModalDetails(id, type = 'movie') {
  try {
    await model.getMovieDetails(id, type);

    view.generateModalDetailsMarkup(model.state.details);
  } catch (err) {
    console.error(`please try again: ${err}`);
  }
}

function init() {
  view.modalEvent();
  helper.closeOnClick();
  view.searchInput(controlSuggestion);
  view.suggestionlistData(loadSectionUi);
  view.SectionDetailsData(controlModalDetails);
  view.trendingData(loadSectionUi);
  controlTrending();
}
init();

const swiper = new Swiper('.swiper', {
  modules: [Navigation],
  slidesPerView: 7,
  grabCursor: true,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
