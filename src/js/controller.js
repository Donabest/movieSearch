console.log('Hello');
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import '/node_modules/swiper/swiper-bundle.min.css';

const API_KEY = 'a88569285faf43dba08ff3d8ebf5ce71';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

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

document.addEventListener('keydown', e => {
  if (
    e.key === 'Escape' ||
    (e.key === 'Enter' && searchDisplay.classList.contains('active'))
  ) {
    searchInputtoggle();
  }
  if (
    e.key === 'Escape' ||
    (e.key === 'Enter' && bookmarkDisplay.classList.contains('active'))
  ) {
    bookmarkIcontoggle();
  }
});
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
const movieTrailer = async function (id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
async function movieGenreDetails(id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

const loadTrendingMovie = async function () {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
    );
    const data = await res.json();
    const { results } = data;
    console.log(results);
    swipperWrapper.innerHTML = '';
    swipperWrapper.innerHTML = results
      .map(trending => {
        return `
       <div class="swiper-slide" >
         <img src="${IMG_URL + trending.poster_path}" alt="" data-movie='${
          trending.id
        }' />
       </div>
    `;
      })
      .join('');

    swipperWrapper.addEventListener('click', e => {
      const movieId = +e.target.dataset.movie;
      console.log(movieId);
      modalDetails.innerHTML = '';
      modalDetails.innerHTML = `<span class="spinner"><i class="fa-solid fa-spinner"></i></span>`;
      results.forEach(movie => {
        if (movieId === movie.id) {
          console.log(movie);
          modal.classList.add('show');
          movieTrailer(movie.id).then(movieTrailerData => {
            movieGenreDetails(movie.id).then(movieGenre => {
              console.log(movieGenre);
              const duration = runtime(movieGenre.runtime);
              const html = `
           <span class="modal-hidden"><i class="fa-solid fa-xmark"></i> </span>
             <div class="movie--bg">
            <img src="${IMG_URL + movie.poster_path}" alt="" />
          </div>
          <h4>${movie.title}</h4>
          <div class="modal--catagories">
            <span class="movie--year">${movie.release_date.slice(0, 4)}</span>
            <span class="movie--duration">${duration}</span>
            <span class="movie--age"> ${
              movie.adult === false ? '17+' : '18+'
            }</span>
            <span class="movie--categ">${movieGenre.genres[0].name}</span>
            <span class="movie--genre">${
              movieGenre.genres[1]?.name
                ? movieGenre.genres[1].name
                : movieGenre.genres[0].name
            }</span>
          </div>
          <div class="modal--overview">
            <p>${movie.overview}</p>
          </div>
          <button class="modal--btn-trailer">
            <i class="fa-solid fa-play"></i> <a href="https://www.youtube.com/watch?v=${
              movieTrailerData.results[0].key
            }" target="_blank">play Trailer</a>
          </button>
            <button class="modal--icon">
            <i class="fa-solid fa-bookmark"></i>
          </button>
          `;
              modalDetails.innerHTML = '';
              modalDetails.insertAdjacentHTML('beforeend', html);
            });
          });
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};
loadTrendingMovie();

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
