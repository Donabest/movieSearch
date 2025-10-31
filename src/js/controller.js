console.log('Hello');
import Swiper from 'swiper';
import * as model from './model.js';
import view from './view/view.js';
import * as helper from './helper.js';
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.min.css';
import bookmarkView from './view/bookmarkView.js';

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
function controlAddBookmarks() {
  model.toggleBookmark(model.state.details[1]);

  view.generateModalDetailsMarkup(model.state.details);

  bookmarkView.generateMarkUp(model.state.bookmarks);
}

async function controlBookmarkOnclick(id) {
  await loadSectionUi(id);
}

function render() {
  bookmarkView.generateMarkUp(model.state.bookmarks);
}

async function controlSearch(input) {
  await model.getMovieData(input);
  model.removeNobackground();

  view.generateSearchMarkup(model.state.search);
}
function kk() {
  console.log(model.state.bookmarks);
  model.toggleBookmark(model.state.bookmarks);
  bookmarkView.generateMarkUp(model.state.bookmarks);
}
bookmarkView.b(kk);

function init() {
  view.modalEvent();
  helper.closeOnClick();
  view.InputSuggestion(controlSuggestion);
  view.suggestionlistData(loadSectionUi);
  view.SectionDetailsData(controlModalDetails);
  view.trendingData(loadSectionUi);
  bookmarkView.renderBookmarkmark(controlBookmarkOnclick);
  bookmarkView.markBookmark(controlAddBookmarks);
  view.inputSearch(controlSearch);
  view.searchOnclick(loadSectionUi);
  controlTrending();
  render();
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
