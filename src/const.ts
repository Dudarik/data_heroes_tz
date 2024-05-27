export const OK = 200;

export const BAD_REQUEST = 400;

// export const API_URL = import.meta.env.PROD
//   ? 'https://rickandmortyapi.com/api'
//   : `${origin}/api`;
export const API_URL = `${origin}/api`;

export const API_URL_CHARACTER = `${API_URL}/character`;
export const API_URL_LOCATION = `${API_URL}/location`;
export const API_URL_EPISODE = `${API_URL}/episode`;

export const RECORD_PER_PAGE = 20;

export const statusFilterValues = [
  { option: 'All', value: undefined },
  { option: 'Alive', value: 'alive' },
  { option: 'Dead', value: 'dead' },
  { option: 'Unknown', value: 'unknown' },
];
