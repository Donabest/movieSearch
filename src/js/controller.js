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

    //Remove the Results with no background/error and undefined
    // model.state.search.results = model.cleanSearchResults(
    //   model.state.search.results
    // );

    if (model.state.search.results.length === 0) throw err;

    view.renderSuggestionList(model.state.search.results);
  } catch (err) {
    view.suggesMessage();
    console.log(err);
  }
}

// control load ui data's
async function loadSectionUi(id, type) {
  try {
    await model.getMovieDetails(id, type);

    view.generateSectionMarkup(model.state.details);
  } catch (err) {
    view.renderErrorMessage(err);
    console.log(err);
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
    console.log(err);
  }
}

//control movie modal details
async function controlModalDetails(id, type = 'movie') {
  try {
    await model.getMovieDetails(id, type);

    view.generateModalDetailsMarkup(model.state.details, type);
  } catch (err) {
    view.renderErrorMessage(
      ' Please Check Your Internet Connection or Try Again Later'
    );
    console.log(err);
  }
}

//control the bookmark in search result section
function controlSearchResultsBookmark(id) {
  model.toggle(model.state.search.results, id);

  bookmarkView.generateMarkUp(model.state.bookmarks);
  // model.state.search.results = model.cleanSearchResults(model.state.search.results);

  view.generateSearchMarkup(model.state.search.results);
  // view.update(model.state.search.results);
}

//Control Bookmark Add and Remove
function controlAddBookmarks() {
  model.toggleBookmark(model.state.details[1]);

  view.generateModalDetailsMarkup(model.state.details);

  bookmarkView.generateMarkUp(model.state.bookmarks);
}

//Control the Bookmark rendering when click
async function controlBookmarkOnclick(id) {
  const bookmark = model.state.bookmarks.find(b => b.id === +id);
  if (!bookmark) return;
  const type = bookmark.type || bookmark.media_type;
  await loadSectionUi(id, type);
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

    // model.state.search.results = model.cleanSearchResults(
    //   model.state.search.results
    // );

    if (model.state.search.results.length === 0) throw err;

    view.generateSearchMarkup(model.state.search.results);
  } catch (err) {
    view.renderMessage('Search Result Not Found');
    console.log(err);
  }
}

//Control the bookmark icon in the Bookmark section
function controlBookmarkSectionIcon(id) {
  //Delete bookmark
  model.DeleteBookmark(id);

  //render bookmark after delete
  bookmarkView.generateMarkUp(model.state.bookmarks);
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
  bookmarkView.renderBookmarkToUi(controlBookmarkOnclick);
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
