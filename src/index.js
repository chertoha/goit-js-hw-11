import { Notify } from 'notiflix';
import notificationsConfig from './js/utils/notifications-config';
import msg from './js/utils/messages';
import refs from './js/utils/refs';
import Gallery from './js/gallery';

import template from './templates/gallery-template.hbs';

Notify.init(notificationsConfig);

refs.form.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

const gallery = new Gallery();

function onSubmitForm(e) {
  e.preventDefault();

  switchLoadMoreBtn(false);

  const userValue = e.target.elements.searchQuery.value.trim();

  //Empty value notification
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

async function fetchValue(value) {
  switchLoaderIcon(true);

  try {
    const data = await gallery.fetchToGallery(value);
    renderGallery(data);
    gallery.pageIncrease();
  } catch (error) {
    Notify.failure(msg.requestError(error));
    switchLoaderIcon(false);
  }
}

function renderGallery(data) {
  const totalHits = data.totalHits;
  const page = gallery.page;
  const perPage = gallery.perPage;

  switchLoaderIcon(false);

  //No matches notification
  if (!data.hits.length) {
    Notify.failure(msg.NO_MATCHES);
    return;
  }

  //First search notificatioin
  if (page === 1) {
    Notify.success(msg.totalHits(data.totalHits));
  }

  //Render html
  refs.gallery.insertAdjacentHTML('beforeend', template(data.hits));

  scrollAfterRender();

  // End of hits notification
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

function scrollAfterRender() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
