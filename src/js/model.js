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
    state.details[1].type = type;

    if (state.bookmarks.some(bookmark => bookmark.id === data2.id)) {
      state.details[1].bookmarked = true;
    } else state.details[1].bookmarked = false;
    if (data1.success === false) throw new Error(`${data1.status_message}`);
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
    if (!movie.type && state.details[1]?.type)
      movie.type = state.details[1].type;

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
  const cleanResult = cleanSearchResults(state.search.results);
  const data = cleanResult.find(data => data.id === +id);
  const index = state.bookmarks.findIndex(el => el.id === data.id);
  if (index === -1) {
    state.bookmarks.push(data);

    data.bookmarked = true;
  } else {
    state.bookmarks.splice(index, 1);
    data.bookmarked = false;
  }

  if (data.id === id) data.bookmarked = !data.bookmarked;
  cleanResult.map(b => {
    if (id === b.id) b.bookmarked = data.bookmarked;
  });
  persistance();
}

export function cleanSearchResults(data) {
  if (!data && !Array.isArray(data)) return [];
  return data.filter(movie => {
    return (
      movie.backdrop_path &&
      movie.poster_path &&
      (movie.overview || movie.biography)
    );
  });
}

function init() {
  const getStoredMovie = JSON.parse(localStorage.getItem('movie'));
  if (getStoredMovie) state.bookmarks = getStoredMovie;
}
init();
