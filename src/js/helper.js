export const swipperWrapper = document.querySelector('.swiper-wrapper');
export const hamburgerMenu = document.querySelector('.fa-bars');
export const cancelMenu = document.querySelector('.fa-xmark');
export const sideBarMenu = document.querySelector('.side-nav');
export const searchIcon = document.querySelectorAll('.search-icon');
export const searchDisplay = document.querySelector('.search-overlay');
export const bookmrkIcon = document.querySelector('.bookmarks--icon');
export const bookmarkDisplay = document.querySelector('.bookmark-overlay');
export const modal = document.querySelector('.modal');
export const modalDetails = document.querySelector('.modal--detail');
export const inputWrapper = document.querySelector('.search-input-wrapper');
export const sectionContent = document.querySelector('.section-content');
export const suggestionList = document.querySelector('.suggestion-list');
export const inputValue = document.querySelector('.search-input');

export const runtime = function (runtime) {
  if (!runtime) return;
  const hour = Math.floor(runtime / 60);
  const min = runtime % 60;
  return `${hour}h : ${min}m`;
};
export function closeOnClick() {
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
      searchDisplay.classList.toggle('active');
    }

    if (
      bookmarkDisplay.classList.contains('active') &&
      !e.target.closest('.bookmarks-fetaures') &&
      !e.target.closest('.bookmarks--icon')
    ) {
      bookmarkDisplay.classList.toggle('active');
    }
  });
}
