export default {
  NO_MATCHES:
    'Sorry, there are no images matching your search query. Please try again.',
  EMPTY_STRING: 'We cannot search empty string! Type something in query field',
  END_RESULTS: "We're sorry, but you've reached the end of search results.",
  NOT_ENOUGH_CONTENT: 'Not enough content for infinite scroll',

  totalHits(totalHits) {
    return `Hooray! We found ${totalHits} images.`;
  },

  requestError(error) {
    return `Sorry, wrong request. ${error}`;
  },
};
