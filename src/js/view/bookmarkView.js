import * as helper from '../helper';
import { POST_URL } from '../config';

class bookmarksView {
  _parentElement = document.querySelectorAll('.bookmarks-list');

  renderBookmarkmark(data) {
    this._parentElement.forEach(parentEl => {
      parentEl.addEventListener('click', e => {
        const target = e.target.closest('.bookmarks-content');
        if (!target) return;
        const id = target.dataset.id;
        data(id);
        helper.bookmarkDisplay.classList.remove('active');
      });
    });
  }

  markBookmark(handler) {
    helper.modal.addEventListener('click', e => {
      const btn = e.target.closest('.modal--icon');
      console.log(btn);
      if (!btn) return;
      handler();
    });
  }

  generateMarkUp(data) {
    this._parentElement.forEach(parentEl => {
      parentEl.innerHTML = data
        .map(bookmark => {
          return `
          <li class="preview-bookmarks">
            <div class="bookmarks-img">
              <img src="${
                POST_URL + (bookmark.poster_path || bookmark.backdrop_path)
              }" />
              <span class="bookmarks-content" data-id="${bookmark.id}">${
            bookmark.title || bookmark.name
          }  </span>
            </div>
            <span class="bookmarks-icon"
              ><i class="fa-${
                bookmark.bookmarked === true ? 'solid' : 'regular'
              } fa-bookmark"></i
            ></span>
          </li>
        `;
        })
        .join('');
    });
  }
}
export default new bookmarksView();
