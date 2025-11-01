console.log('Hello');
import Swiper from 'swiper';
import * as model from './model.js';
import view from './view/view.js';
import * as helper from './helper.js';
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.min.css';
import bookmarkView from './view/bookmarkView.js';

//Control Suggestion input data and the list
async function controlSuggestion(input) {
  try {
    await model.getMovieData(input);

    view.renderSuggestionList(model.state.search);
  } catch (err) {
    view.renderErrorMessage(
      'Please Check Your Internet Connection or Try Again Later'
    );
  }
}

// control load ui data's
async function loadSectionUi(id, type) {
  try {
    await model.getMovieDetails(id, type);
    view.generateMarkup(model.state.details, type);
  } catch (err) {
    view.renderErrorMessage(
      'Please Check Your Internet Connection or Try Again Later'
    );
  }
}

//Control Trending section data's
async function controlTrending() {
  try {
    await model.getMovieData();
    view.renderTrending(model.state.trending);
  } catch (err) {
    view.renderErrorMessage(
      'Please Check Your Internet Connection or Try Again Later'
    );
  }
}

//control movie modal details
async function controlModalDetails(id, type = 'movie') {
  try {
    await model.getMovieDetails(id, type);

    view.generateModalDetailsMarkup(model.state.details);
  } catch (err) {
    view.renderErrorMessage(
      'please try again: Please Check Your Internet Connection or Try Again Later'
    );
  }
}

//control the bookmark in search result section
function controlSearchResultsBookmark(id) {
  model.toggle(id);

  bookmarkView.generateMarkUp(model.state.bookmarks);

  view.generateSearchMarkup(model.state.search);
}

//Control Bookmark Add and Remove
function controlAddBookmarks() {
  model.toggleBookmark(model.state.details[1]);

  view.generateModalDetailsMarkup(model.state.details);

  bookmarkView.generateMarkUp(model.state.bookmarks);
}

//Control the Bookmark rendering when click
async function controlBookmarkOnclick(id) {
  await loadSectionUi(id);
}

//Control the bookmark section
function controlRenderSectionBookmark() {
  bookmarkView.generateMarkUp(model.state.bookmarks);
  if (model.state.bookmarks.length === 0) bookmarkView.renderMessage();
}

//Control the Search Section
async function controlSearch(input) {
  try {
    await model.getMovieData(input);

    model.removeNobackground();

    if (model.state.search.results.length === 0) {
      view.renderError('Search Result Not Found');
    }

    view.generateSearchMarkup(model.state.search);
  } catch (err) {
    view.renderErrorMessage(
      'Please Check Your Internet Connection or Try Again Later'
    );
  }
}

//Control the bookmark icon in the Bookmark section
function controlBookmarkSectionIcon(id) {
  model.tooglebookmarkIcon(id);
  bookmarkView.generateMarkUp(model.state.bookmarks);
  if (model.state.bookmarks.length === 0) bookmarkView.renderMessage;
}

function init() {
  view.modalEvent();
  helper.closeOnClick();
  view.InputSuggestion(controlSuggestion);
  view.suggestionlistData(loadSectionUi);
  view.SectionDetailsData(controlModalDetails);
  view.trendingData(loadSectionUi);
  view.inputSearch(controlSearch);
  view.searchOnclick(loadSectionUi);
  bookmarkView.resultsBookmark(controlSearchResultsBookmark);
  bookmarkView.renderBookmarkmark(controlBookmarkOnclick);
  bookmarkView.markBookmark(controlAddBookmarks);
  bookmarkView.renderBookmarkIcon(controlBookmarkSectionIcon);
  controlTrending();
  controlRenderSectionBookmark();
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
