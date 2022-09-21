import fetchImages from './fetch-images';
import { queryOptions } from './utils/api-config';

export default class Gallery {
  #perPage;
  #page;
  #currentQuery;
  #isUploading;

  constructor() {
    this.#page = queryOptions.page;
    this.#perPage = queryOptions.per_page;
    this.#currentQuery = null;
    this.#isUploading = false;
  }

  fetchToGallery(query) {
    this.#currentQuery = query;
    return fetchImages(query, this.#page, this.#perPage);
  }

  pageIncrease() {
    this.#page += 1;
  }

  pageReset() {
    this.#page = 1;
  }

  get page() {
    return this.#page;
  }

  get perPage() {
    return this.#perPage;
  }

  set perPage(value) {
    if (value > 0) {
      this.#perPage = value;
    }

    console.error('per page value must be > 0');
  }

  get currentQuery() {
    return this.#currentQuery;
  }

  get isUploading() {
    return this.#isUploading;
  }

  set isUploading(value) {
    this.#isUploading = !!value;
  }
}
