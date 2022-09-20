const API_KEY = '30013057-0a5f6d6737818554e28c4e8f5';
const BASE_URL = 'https://pixabay.com/api';

export default function fetchImages(query, page, perPage) {
  const queryOptions = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  };

  const url = `${BASE_URL}?${stringifyQueryOptions(queryOptions)}`;

  console.log(url);

  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.text);
  });
}

function stringifyQueryOptions(options) {
  let optionsArr = [];
  for (const option in options) {
    if (options.hasOwnProperty(option)) {
      optionsArr.push(`${option}=${options[option]}`);
    }
  }
  return optionsArr.join('&');
}
