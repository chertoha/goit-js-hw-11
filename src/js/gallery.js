import fetchImages from './fetch-images';

export default class Gallery {
  #perPage;
  #page;
  #currentQuery;

  constructor() {
    this.#page = 1;
    this.#perPage = 10;
    this.#currentQuery = null;
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

  set perPage(value) {
    if (value > 0) {
      this.#perPage = value;
    }

    console.error('per page value must be > 0');
  }

  get perPage() {
    return this.#perPage;
  }

  get currentQuery() {
    return this.#currentQuery;
  }

  get page() {
    return this.#page;
  }
}
