import { API_KEY, BASE_URL } from './config';
export const state = {
  trending: {},
  search: {},
  video: {},
  details: {},
  bookmarks: [],
  noBack: [],
  type: [],
};

export async function getMovieData(query) {
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`),
    ]);
    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
    state.trending = data1.results;
    state.search = data2;

    return data1, data2;
  } catch (err) {
    throw err;
  }
}

export async function getMovieDetails(id, type = 'movie') {
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`),
    ]);
    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
    state.details = [data1, data2];
    if (state.bookmarks.some(bookmark => bookmark.id === data2.id)) {
      state.details[1].bookmarked = true;
    } else state.details[1].bookmarked = false;

    return data1, data2;
  } catch (err) {
    throw err;
  }
}
function persistance() {
  localStorage.setItem('movie', JSON.stringify(state.bookmarks));
}

export function toggleBookmark(movie) {
  const index = state.bookmarks.findIndex(el => el.id === movie.id);

  if (index === -1) {
    state.bookmarks.push(movie);
    state.details[1].bookmarked = true;
  } else {
    state.bookmarks.splice(index, 1);

    state.details[1].bookmarked = false;
  }

  if (movie.id === state.details[1].id)
    state.details[1].bookmarked = movie.bookmarked;

  persistance();
}

export function DeleteBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id === +id);
  state.bookmarks.splice(index, 1);
  state.bookmarks.map(b => {
    if (id === b.id) b.bookmarked = false;
  });
  persistance();
}

export function toggle(id) {
  const data = state.search.results.find(data => data.id === +id);
  state.bookmarks.push(data);
  data.bookmarked = true;
  persistance();
}

export function removeNobackground() {
  state.noBack.push(...state.search.results);
  state.noBack.filter(movie => {
    const backdrop = movie.backdrop_path && movie.backdrop_path !== 'null';
    const hasProfile = movie.profile_path && movie.profile_path !== 'null';
    return backdrop || hasProfile;
  });
}

function init() {
  const getStoredMovie = JSON.parse(localStorage.getItem('movie'));
  if (getStoredMovie) state.bookmarks = getStoredMovie;
}
init();
