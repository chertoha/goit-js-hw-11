import throttle from 'lodash.throttle';
import { Notify } from 'notiflix';
import notificationsConfig from './js/utils/notifications-config';
import msg from './js/utils/messages';
import refs from './js/utils/refs';
import Gallery from './js/gallery';
import template from './templates/gallery-template.hbs';
import Modal from './js/modal';

const modal = new Modal();
modal.show();
const isInfiniteScrollActive = modal.isScroll;

Notify.init(notificationsConfig);

refs.form.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

const gallery = new Gallery();
// const isInfiniteScrollActive = true;
const throttledOnWindowScroll = throttle(onWindowScroll, 400);

/*------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------*/
//Handlers
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

  switchScrollListener(isInfiniteScrollActive);
}

function onLoadMoreBtnClick() {
  fetchValue(gallery.currentQuery);
}

function onWindowScroll() {
  if (gallery.isUploading) {
    return;
  }

  const viewportHeight = window.innerHeight;
  const { bottom: lastElDistance } =
    refs.gallery.lastElementChild.getBoundingClientRect();

  if (viewportHeight + 100 > lastElDistance) {
    fetchValue(gallery.currentQuery);
  }
}

//Fetch API function
async function fetchValue(value) {
  switchLoaderIcon(true);

  try {
    gallery.isUploading = true;

    const data = await gallery.fetchToGallery(value);

    gallery.isUploading = false;

    renderGallery(data);
    gallery.pageIncrease();
  } catch (error) {
    Notify.failure(msg.requestError(error));
    switchLoaderIcon(false);
  }
}

//Render
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

  console.log(gallery);

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
    switchScrollListener(false);
    return;
  }

  switchLoadMoreBtn(!isInfiniteScrollActive);
}

//Switch functions
function switchLoadMoreBtn(isEnabled) {
  refs.loadMoreBtn.classList.toggle('hidden', !isEnabled);
}

function switchLoaderIcon(isEnabled) {
  refs.loader.classList.toggle('not-active', !isEnabled);
}

function switchScrollListener(isEnabled) {
  if (isEnabled) {
    window.addEventListener('scroll', throttledOnWindowScroll);
  } else {
    window.removeEventListener('scroll', throttledOnWindowScroll);
  }
}

//Animation functions
function scrollAfterRender() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
