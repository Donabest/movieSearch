import { IMG_URL, POST_URL, YOUTUBE_URL } from '../config';
import * as helper from '../helper.js';

const header = document.getElementById('main--header');
const errMessage = document.querySelector('.error-message');

class View {
  constructor() {
    helper.hamburgerMenu.addEventListener('click', this.toggle.bind(this));
    helper.cancelMenu.addEventListener('click', this.toggle.bind(this));
    helper.bookmrkIcon.addEventListener(
      'click',
      this.bookmarkIcontoggle.bind(this)
    );
    helper.searchIcon.forEach(searchIcon => {
      searchIcon.addEventListener('click', this.searchInputtoggle.bind(this));
    });
  }

  toggle() {
    helper.sideBarMenu.classList.toggle('active');
  }
  searchInputtoggle() {
    helper.searchDisplay.classList.toggle('active');
  }
  bookmarkIcontoggle() {
    helper.bookmarkDisplay.classList.toggle('active');
  }

  modalEvent() {
    helper.modalDetails.addEventListener('click', function (e) {
      const cancelbtn = e.target.closest('.fa-xmark');
      if (!cancelbtn) return;
      helper.modal.classList.remove('show');
    });
  }
  trendingData(handler) {
    helper.swipperWrapper.addEventListener('click', e => {
      const target = e.target.closest('.swiper-slide');
      const id = +target.dataset.movie;
      if (!id) return;
      handler(id);
    });
  }

  inputSearch(handler) {
    helper.inputWrapper.addEventListener('submit', e => {
      e.preventDefault();
      const input = document.querySelector('.search-input');
      const inputValue = input.value.trim().toLowerCase();
      if (!inputValue) return;
      input.value = '';
      const view = document.querySelector('.search-view');
      view.classList.remove('hidden');
      view.scrollIntoView({ behavior: 'smooth' });
      handler(inputValue);
      helper.searchDisplay.classList.remove('active');
      errMessage.classList.add('hidden');
    });
  }

  searchOnclick(handler) {
    helper.grid.addEventListener('click', e => {
      const target = e.target.closest('.search-view-card-img');
      if (!target) return;
      const type = target.dataset.type;
      const id = target.dataset.id;
      handler(id, type);
      header.scrollIntoView({ behavior: 'smooth' });
    });
  }

  InputSuggestion(handlers) {
    helper.inputWrapper.addEventListener('input', function (e) {
      e.preventDefault();
      const inputValue = e.target.value.trim().toLowerCase();
      if (inputValue == ' ') return;
      if (!inputValue) return;
      handlers(inputValue);
    });
  }

  renderSuggestionList(data) {
    const results = data.results.splice(0, 5);
    helper.suggestionList.innerHTML = results
      .map(suggestion => {
        return `<li  class="sugges--list" data-sugges="${
          suggestion.id
        }" data-type="${suggestion.media_type}">${
          suggestion.title || suggestion.name
        }</li>`;
      })
      .join('');
  }

  suggestionlistData(handler) {
    helper.suggestionList.addEventListener('click', e => {
      const target = e.target.closest('.sugges--list');
      const id = target.dataset.sugges;
      const type = target.dataset.type;
      handler(id, type);
    });
  }

  SectionDetailsData(handler) {
    helper.sectionContent.addEventListener('click', e => {
      const target = e.target.closest('.btn-details');
      const id = target.dataset.detail;
      const type = target.dataset.type;
      if (!id) return;
      handler(id, type);
      return id;
    });
  }

  generateSectionMarkup(data, type) {
    header.style.background = `linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9) 0,
      rgba(0, 0, 0, 0.4) 60%,
       rgba(0, 0, 0, 0.95) 100%
    ),url('${
      data[1].backdrop_path
        ? IMG_URL + data[1].backdrop_path
        : POST_URL + data[1].profile_path
    }')`;
    header.style.backgroundPosition = 'center';
    header.style.backgroundRepeat = 'no-repeat';
    header.style.backgroundSize = 'cover';

    helper.sectionContent.innerHTML = `
          <h2>${data[1].title || data[1].name}</h2>
          <p>${data[1].overview || data[1].biography}</p>
          <div class="section-btn">
            <button class="btn btn--watch ${
              data[0].results.length === 0 ? '' : 'show'
            }">
              <a href="${
                YOUTUBE_URL + data[0]?.results[0]?.key ?? ''
              }" target="_blank">Watch Now</a
              ><i class="fa-solid fa-play"></i>
            </button>
            <button class="btn btn-details " data-detail="${
              data[1].id
            } " data-type="${type || 'movie'}">
              Details <i class="fa-solid fa-angle-right"></i>
            </button>
          </div>`;

    helper.searchDisplay.classList.remove('active');
    helper.inputValue.value = '';
    helper.suggestionList.innerHTML = '';
  }

  renderTrending(data) {
    const results = data;
    helper.swipperWrapper.innerHTML = '';
    helper.swipperWrapper.innerHTML = results
      .map(trending => {
        return `
            <div class="swiper-slide"  data-movie='${trending.id}'>
              <img src="${
                POST_URL + trending.poster_path
              }" alt="" data-movie='${trending.id}' />
            </div>
          `;
      })
      .join('');
  }

  generateSearchMarkup(data) {
    const html = data.results
      .map(data => {
        return ` 
         <div class="search-view-card">
            <div class="search-view-card-img" data-type="${
              data.media_type
            }" data-id="${data.id}">
              <img src="${
                POST_URL + data.poster_path || POST_URL + data.backdrop_path
              }" alt="" />
            </div>
            <div class="display">
              <h4>${data.title || data.name}</h4>
              <div class="modal--catagories cate">
                <span class="movie--year">${
                  data.first_air_date || data.release_date
                }</span>
                <span class="movie--categ">${data.media_type}</span>
              </div>
              <div class="modal--overview overview">
                <p>${data.overview || data.biography}</p>
              </div>
              <div class="modal-btn-section btn">
                <button class="modal--icon bookmarks-icon" data-id=${
                  data.id
                } data-type="${data.media_type}">
                  <i class="fa-${
                    data.bookmarked === true ? 'solid' : 'regular'
                  } fa-bookmark"></i>
                </button>
              </div>
            </div>
         </div>
      `;
      })
      .join('');
    helper.grid.innerHTML = '';
    helper.suggestionList.innerHTML = '';
    helper.grid.insertAdjacentHTML('beforeend', html);
  }

  generateModalDetailsMarkup(data) {
    helper.modal.classList.add('show');
    helper.modalDetails.innerHTML = '';
    helper.modalDetails.innerHTML = `<span class="spinner"><i class="fa-solid fa-spinner"></i></span>`;
    let duration, season;
    if (data[1].runtime) duration = helper.runtime(data[1].runtime);
    if (data[1].seasons) season = `${data[1].seasons.length} seasons`;
    const html = `
      <span class="modal-hidden"><i class="fa-solid fa-xmark"></i> </span>
      <div class="movie--bg">
        <img src="${POST_URL + data[1].poster_path}" alt="" />
      </div>
      <h4>${data[1].title || data[1].name}</h4>
      <div class="modal--catagories">
          <span class="movie--year">${
            data[1].release_date?.slice(0, 4) ||
            data[1].first_air_date.slice(0, 4)
          }</span>
          <span class="movie--duration">${
            duration === undefined ? season : duration
          }</span>
          <span class="movie--age"> ${
            data[1].adult === false ? '17+' : '18+'
          }</span>
          <span class="movie--categ">${data[1]?.genres[0].name}</span>
          <span class="movie--genre">${
            data[1].genres[1] ? data[1].genres[1].name : data[1].genres[0].name
          }</span>
      </div>
      <div class="modal--overview">
        <p>${data[1].overview || data[1].biography}</p>
      </div>
      <div class="modal-btn-section">
        <button class="modal--btn-trailer ${
          data[0].results.length === 0 ? 'hidden' : 'show'
        }">
        <i class="fa-solid fa-play "></i> <a href="${
          YOUTUBE_URL + data[0]?.results[0]?.key ?? ''
        }" target="_blank">play Trailer</a>
        </button>
        <button class="modal--icon">
          <i class="fa-${
            data[1].bookmarked === true ? 'solid' : 'regular'
          } fa-bookmark"></i>
        </button>
      </div>
    `;
    helper.modalDetails.innerHTML = '';
    helper.modalDetails.insertAdjacentHTML('beforeend', html);
  }

  renderMessage(message) {
    const parentEl = document.querySelector('.search-view--view');
    parentEl.innerHTML = '';
    const mark = `
      <div class="search-error-message">
         <h4>${message}</i></h4>
       </div>
    `;
    parentEl.insertAdjacentHTML('beforeend', mark);
  }

  renderErrorMessage(message = 'error') {
    errMessage.classList.remove('hidden');
    errMessage.innerHTML = `
      <div class="error-message-overlay">
        <div class="error-message-modal">
          <p><i class="fa-solid fa-ban"></i>${message}</p>
        </div>
      </div>
    `;
  }
}
export default new View();
