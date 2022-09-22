import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import throttle from 'lodash.throttle';
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
let isInfiniteScrollActive = getIsInfiniteScrollEnabledFromStorage();
const throttledOnWindowScroll = throttle(onWindowScroll, 400);

const lightbox = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.5,
  captionsData: 'alt',
  captionClass: 'gallery__image-caption',
  captionDelay: 250,
});

setRadioChecked();

/*------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------*/

//Handlers
function onSubmitForm(e) {
  e.preventDefault();

  const isUploadScroll = e.target.elements.uploadScroll.value;
  const userValue = e.target.elements.searchQuery.value.trim();

  setIsInfiniteScrollEnabledToStorage(isUploadScroll);
  isInfiniteScrollActive = getIsInfiniteScrollEnabledFromStorage();

  switchLoadMoreBtn(false);

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

  if (checkLastGalleryElementPos()) {
    fetchValue(gallery.currentQuery);
  }
}

//Check if viewport size more than last gallery element total height
function checkLastGalleryElementPos() {
  const viewportHeight = window.innerHeight;
  const { bottom: lastElDistance } =
    refs.gallery.lastElementChild.getBoundingClientRect();

  return viewportHeight + 100 > lastElDistance;
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

///////////////////////////////////////////////////////////////////////////////////////////
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
  lightbox.refresh();

  scrollAnimationAfterRender();

  // End of hits notification
  if (page * perPage >= totalHits) {
    Notify.info(msg.END_RESULTS);
    switchLoadMoreBtn(false);
    switchScrollListener(false);
    return;
  }

  //Ensufficient cards per viewport notification
  if (isInfiniteScrollActive && checkLastGalleryElementPos()) {
    isInfiniteScrollActive = false;
    switchScrollListener(false);
    Notify.warning(msg.NOT_ENOUGH_CONTENT);
  }

  switchLoadMoreBtn(!isInfiniteScrollActive);
}
///////////////////////////////////////////////////////////////////////////////////////////

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

//Scroll animation function
function scrollAnimationAfterRender() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

//Infinite scrool is enabled set/get Local Storage
function setIsInfiniteScrollEnabledToStorage(isEnabled) {
  localStorage.setItem('isInfiniteScrollEnabled', isEnabled);
}

function getIsInfiniteScrollEnabledFromStorage() {
  return !!JSON.parse(localStorage.getItem('isInfiniteScrollEnabled'));
}

function setRadioChecked() {
  if (getIsInfiniteScrollEnabledFromStorage()) {
    refs.radioScroll.checked = true;
  } else {
    refs.radioUploadBtn.checked = true;
  }
}
