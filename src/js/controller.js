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

const loadTrendingMovie = async function () {
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
       <div class="swiper-slide">
         <img src="${IMG_URL + trending.poster_path}" alt="" />
       </div>
    `;
    })
    .join('');
};
console.log('Hello');
loadTrendingMovie();

const searchQuery = async function () {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=berlin`
  );
  const data = await res.json();
  console.log(data);
};
searchQuery();

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
