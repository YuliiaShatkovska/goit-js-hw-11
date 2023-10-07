import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from '/src/axios';

const form = document.getElementById('search-form');
const loadButton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

loadButton.style.display = 'none';

form.addEventListener('submit', handleSearchImages);
loadButton.addEventListener('click', handleLoadMore);

let currentPage = 1;

function handleSearchImages(e) {
  e.preventDefault();
  const value = form.searchQuery.value.trim();

  if (value !== '') {
    searchImages(value);
  }
}

function handleLoadMore() {
  const value = form.searchQuery.value.trim();
  if (value !== '') {
    currentPage += 1;

    searchImages(value, currentPage);
    scroll();
  }
}

const lightbox = new SimpleLightbox('.photo-card a');

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoadMoreButton() {
  loadButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadButton.style.display = 'none';
}

function scroll() {
  const { height: cardHeight } =
    gallery.lastElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function createMarkup(array) {
  const galleryHTML = array
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        views,
        likes,
        downloads,
        comments,
      }) => `<div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
        </div>
      </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', galleryHTML);
  lightbox.refresh();
}

async function searchImages(value, page = 1) {
  if (page === 1) {
    clearGallery();
    currentPage = 1;
  }

  const params = {
    q: value,
    page: page,
  };

  try {
    const response = await axios.get('', { params });
    const data = response.data;
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createMarkup(data.hits);
    }
    if (page === 1) {
      Notiflix.Notify.success(`We found ${data.totalHits} images.`);
    }
    if (gallery.childElementCount < data.totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error('Error', error);
  }
}

Notiflix.Notify.init();
