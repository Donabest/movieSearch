import { API_KEY, BASE_URL } from './config';
export const state = {
  trending: {},
  search: {},
  video: {},
  details: {},
};

export async function getMovieData(query = 'batman') {
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
    return data1, data2;
  } catch (err) {
    throw err;
  }
}
