const axios = require('axios').default;
import { BASE_URL, queryOptions } from './utils/api-config';

export default async function fetchImages(query, page, perPage) {
  queryOptions.q = query;
  queryOptions.page = page;
  queryOptions.per_page = perPage;

  const url = `${BASE_URL}?${stringifyQueryOptions(queryOptions)}`;

  // console.log('url = ', url);

  const response = await axios.get(url);

  // console.log(response);
  return response.data;
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
