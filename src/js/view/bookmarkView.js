import * as helper from '../helper';
import { POST_URL } from '../config';

class bookmarksView {
  _parentElement = document.querySelectorAll('.bookmarks-list');

  renderBookmarkmark(data) {
    this._parentElement.forEach(parentEl => {
      parentEl.addEventListener('click', e => {
        const target = e.target.closest('.bookmarks-content');
        const id = target.dataset.id;
        if (!target && !id) return;
        data(id);
        helper.bookmarkDisplay.classList.remove('active');
      });
    });
  }

  renderBookmarkIcon(handler) {
    this._parentElement.forEach(bbtn =>
      bbtn.addEventListener('click', e => {
        const btn = e.target.closest('.bookmarks-icon');
        const id = btn.dataset.id;
        if (!btn) return;
        handler(id);
      })
    );
  }

  markBookmark(handler) {
    helper.modal.addEventListener('click', e => {
      const btn = e.target.closest('.modal--icon');
      if (!btn) return;
      handler();
    });
  }

  resultsBookmark(handler) {
    helper.grid.addEventListener('click', e => {
      const target = e.target.closest('.bookmarks-icon');
      if (!target) return;
      const id = target.dataset.id;
      // const type = target.dataset.type;
      handler(id);
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
            <span class="bookmarks-icon" data-id="${bookmark.id}"
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

  renderMessage() {
    this._parentElement.forEach(parentEl => {
      parentEl.innerHTML = '';
      parentEl.innerHTML = `<li class="message">
        <span>No BookMark yet</span>
      </li>`;
    });
  }
}
export default new bookmarksView();
