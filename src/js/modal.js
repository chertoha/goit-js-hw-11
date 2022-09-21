import template from '../templates/modal-upload-template.hbs';

export default class UploadMethodModal {
  #isScroll;

  constructor() {
    this.isModalOpen = true;
    this.#isScroll = false;

    const modalData = {
      text: 'Upload-more method: "Infinite scroll" or "Upload-more button"',
      leftBtnName: 'Scroll',
      rightBtnName: 'Button',
    };
    this.modalHtml = template(modalData);
  }

  show() {
    document.body.insertAdjacentHTML('afterbegin', this.modalHtml);

    this.modal = document.querySelector('.modal-upload');
    this.clicker = document.querySelector('.modal-upload__clicker');
    this.leftBtn = document.querySelector('.modal-upload--left');
    this.rightBtn = document.querySelector('.modal-upload--right');

    this.clicker.addEventListener('click', () => {
      //   console.log(this.isModalOpen);
      this.modal.classList.toggle('js-visible', !this.isModalOpen);
      this.isModalOpen = !this.isModalOpen;
    });

    this.leftBtn.addEventListener('click', () => {
      this.#isScroll = true;
    });

    this.rightBtn.addEventListener('click', () => {
      this.#isScroll = false;
    });
  }

  get isScroll() {
    return this.#isScroll;
  }
}
