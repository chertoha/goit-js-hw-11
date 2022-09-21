const API_KEY = '30013057-0a5f6d6737818554e28c4e8f5';
const BASE_URL = 'https://pixabay.com/api';

const queryOptions = {
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  page: 1,
  per_page: 40,
};

export { BASE_URL, queryOptions };
