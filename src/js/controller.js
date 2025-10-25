console.log('Hello');
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.min.css';

const API_KEY = 'a88569285faf43dba08ff3d8ebf5ce71';
const POST_URL = 'https://image.tmdb.org/t/p/w500';
const IMG_URL = 'https://image.tmdb.org/t/p/original/';
const BASE_URL = 'https://api.themoviedb.org/3';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=';

const swipperWrapper = document.querySelector('.swiper-wrapper');
const hamburgerMenu = document.querySelector('.fa-bars');
const cancelMenu = document.querySelector('.fa-xmark');
const sideBarMenu = document.querySelector('.side-nav');
const searchIcon = document.querySelectorAll('.search-icon');
const searchDisplay = document.querySelector('.search-overlay');
const bookmrkIcon = document.querySelector('.bookmarks--icon');
const bookmarkDisplay = document.querySelector('.bookmark-overlay');
const modal = document.querySelector('.modal');
const modalDetails = document.querySelector('.modal--detail');
const inputWrapper = document.querySelector('.search-input-wrapper');
const sectionContent = document.querySelector('.section-content');
const suggestionList = document.querySelector('.suggestion-list');
const inputValue = document.querySelector('.search-input');

const runtime = function (runtime) {
  const hour = Math.floor(runtime / 60);
  const min = runtime % 60;
  return `${hour}h : ${min}m`;
};

function toggle() {
  sideBarMenu.classList.toggle('active');
}
function searchInputtoggle() {
  searchDisplay.classList.toggle('active');
}
function bookmarkIcontoggle() {
  bookmarkDisplay.classList.toggle('active');
}

hamburgerMenu.addEventListener('click', toggle);
cancelMenu.addEventListener('click', toggle);
bookmrkIcon.addEventListener('click', bookmarkIcontoggle);
searchIcon.forEach(searchIcon => {
  searchIcon.addEventListener('click', searchInputtoggle);
});

modalDetails.addEventListener('click', function (e) {
  const cancelbtn = e.target.closest('.fa-xmark');
  if (!cancelbtn) return;
  modal.classList.remove('show');
});

// document.addEventListener('keydown', e => {
//   if (
//     e.key === 'Escape' ||
//     (e.key === 'Enter' && searchDisplay.classList.contains('active'))
//   ) {
//     searchInputtoggle();
//   }
//   if (
//     e.key === 'Escape' ||
//     (e.key === 'Enter' && bookmarkDisplay.classList.contains('active'))
//   ) {
//     bookmarkIcontoggle();
//   }
// });
document.addEventListener('click', e => {
  if (
    searchDisplay.classList.contains('active') &&
    !e.target.closest('.search-overlay') &&
    !e.target.closest('.search-icon')
  ) {
    searchInputtoggle();
  }

  if (
    bookmarkDisplay.classList.contains('active') &&
    !e.target.closest('.bookmarks-fetaures') &&
    !e.target.closest('.bookmarks--icon')
  ) {
    bookmarkIcontoggle();
  }
});

async function getMovieData(query = 'batman') {
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`),
    ]);
    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
    return [data1, data2];
  } catch (err) {
    console.error(err);
  }
}

async function getMovieDetails(id, type = 'movie') {
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`),
    ]);
    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
    return [data1, data2];
  } catch (err) {
    console.error(err);
  }
}
function movie() {
  inputWrapper.addEventListener('input', function (e) {
    e.preventDefault();
    const inputValue = e.target.value.trim().toLowerCase();
    if (inputValue == ' ') return;
    getMovieData(inputValue).then(data => {
      const results = data[1].results.splice(0, 5);
      suggestionList.innerHTML = results
        .map(suggestion => {
          return `<li data-sugges="${suggestion.id}" data-type="${
            suggestion.media_type
          }">${suggestion.title || suggestion.name}</li>`;
        })
        .join('');
    });
  });

  suggestionList.addEventListener('click', e => {
    const target = e.target.dataset.sugges;
    const type = e.target.dataset.type;
    getMovieDetails(target, type).then(details => {
      const detail1 = details[1];
      const detail0 = details[0];
      const header = document.getElementById('main--header');
      header.style.background = `linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9) 0,
      rgba(0, 0, 0, 0.4) 60%,
      rgba(0, 0, 0, 0.95) 100%
    ),url('${
      detail1.backdrop_path
        ? IMG_URL + detail1.backdrop_path
        : POST_URL + detail1.profile_path
    }')`;
      header.style.backgroundPosition = 'center';
      header.style.backgroundRepeat = 'no-repeat';
      header.style.backgroundSize = 'cover';

      sectionContent.innerHTML = `
          <h2>${detail1.title || detail1.name}</h2>
          <p>${detail1.overview || detail1.biography}</p>
          <div class="section-btn">
            <button class="btn btn--watch ${
              detail0.success === false ? ' ' : 'show'
            } ">
              <a href="${
                detail0.success === false
                  ? ''
                  : YOUTUBE_URL + detail0?.result0?.key
              }" target="_blank">Watch Now</a
              ><i class="fa-solid fa-play"></i>
            </button>
            <button class="btn btn-details">
              Details <i class="fa-solid fa-angle-right"></i>
            </button>
          </div>`;
      searchInputtoggle();
      inputValue.value = '';
      suggestionList.innerHTML = '';
    });
  });
  inputWrapper.addEventListener('submit', e => {
    e.preventDefault();
    const value = inputValue.value.trim().toLowerCase();
    if (!value) return;
  });
}
movie();

async function loadTrendingData() {
  try {
    getMovieData().then(trendingMovie => {
      const results = trendingMovie[0].results;
      swipperWrapper.innerHTML = '';
      swipperWrapper.innerHTML = results
        .map(trending => {
          return `
            <div class="swiper-slide" >
              <img src="${
                POST_URL + trending.poster_path
              }" alt="" data-movie='${trending.id}' />
            </div>
          `;
        })
        .join('');

      swipperWrapper.addEventListener('click', e => {
        const movieId = +e.target.dataset.movie;

        modalDetails.innerHTML = '';
        modalDetails.innerHTML = `<span class="spinner"><i class="fa-solid fa-spinner"></i></span>`;

        results.forEach(movie => {
          if (movieId === movie.id) {
            modal.classList.add('show');

            getMovieDetails(movie.id).then(([movieTrailerData, movieGenre]) => {
              const duration = runtime(movieGenre.runtime);

              const html = `
                <span class="modal-hidden"><i class="fa-solid fa-xmark"></i> </span>
                <div class="movie--bg">
                 <img src="${POST_URL + movie.poster_path}" alt="" />
                </div>
                <h4>${movie.title}</h4>
                <div class="modal--catagories">
                  <span class="movie--year">${movie.release_date.slice(
                    0,
                    4
                  )}</span>
                  <span class="movie--duration">${duration}</span>
                  <span class="movie--age"> ${
                    movie.adult === false ? '17+' : '18+'
                  }</span>
                  <span class="movie--categ">${movieGenre.genres[0].name}</span>
                  <span class="movie--genre">${
                    movieGenre.genres[1]
                      ? movieGenre.genres[1].name
                      : movieGenre.genres[0].name
                  }</span>
                </div>
                <div class="modal--overview">
                  <p>${movie.overview || movie.biography}</p>
                </div>
                <button class="modal--btn-trailer">
                 <i class="fa-solid fa-play"></i> <a href="${
                   YOUTUBE_URL + movieTrailerData.results[0].key
                 }" target="_blank">play Trailer</a>
                </button>
                <button class="modal--icon">
                  <i class="fa-solid fa-bookmark"></i>
                </button>
              `;

              modalDetails.innerHTML = '';
              modalDetails.insertAdjacentHTML('beforeend', html);
            });
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
}
loadTrendingData();

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
