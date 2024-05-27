export const OK = 200;

export const BAD_REQUEST = 400;

export const API_URL = import.meta.env.PROD
  ? 'https://rickandmortyapi.com/api'
  : `${origin}/api`;

export const API_URL_CHARACTER = `${API_URL}/character`;
export const API_URL_LOCATION = `${API_URL}/location`;
export const API_URL_EPISODE = `${API_URL}/episode`;
