import { Notify } from 'notiflix';
import Gallery from './js/gallery';

import template from './templates/gallery-template.hbs';

Notify.init({
  width: '300px',
  position: 'right-bottom',
  fontSize: '16px',
  timeout: '1500',
  clickToClose: true,
});

const msg = {
  NO_MATCHES:
    'Sorry, there are no images matching your search query. Please try again.',
  EMPTY_STRING: 'We cannot search empty string! Type something in query field',
  END_RESULTS: "We're sorry, but you've reached the end of search results.",

  totalHits(totalHits) {
    return `Hooray! We found ${totalHits} images.`;
  },
};

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input[name=searchQuery]'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more-button'),
  loader: document.querySelector('.loader'),
};

refs.form.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

const gallery = new Gallery();

function onSubmitForm(e) {
  e.preventDefault();

  const userValue = e.target.elements.searchQuery.value.trim();
  if (userValue === '') {
    Notify.failure(msg.EMPTY_STRING);
    return;
  }

  refs.gallery.innerHTML = '';
  gallery.pageReset();
  fetchValue(userValue);
}

function onLoadMoreBtnClick() {
  fetchValue(gallery.currentQuery);
}

function fetchValue(value) {
  switchLoaderIcon(true);

  gallery
    .fetchToGallery(value)
    .then(data => {
      renderGallery(data);
      gallery.pageIncrease();
    })
    .catch(console.log);
}

function renderGallery(data) {
  const totalHits = data.totalHits;
  const page = gallery.page;
  const perPage = gallery.perPage;

  switchLoaderIcon(false);

  console.log(data);

  if (!data.hits.length) {
    Notify.failure(msg.NO_MATCHES);
    return;
  }

  if (page === 1) {
    Notify.success(msg.totalHits(data.totalHits));
  }

  refs.gallery.insertAdjacentHTML('beforeend', template(data.hits));

  if (page * perPage >= totalHits) {
    Notify.info(msg.END_RESULTS);
    switchLoadMoreBtn(false);
    return;
  }

  switchLoadMoreBtn(true);
}

function switchLoadMoreBtn(isEnabled) {
  refs.loadMoreBtn.classList.toggle('hidden', !isEnabled);
}

function switchLoaderIcon(isEnabled) {
  refs.loader.classList.toggle('not-active', !isEnabled);
}
