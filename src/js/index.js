// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  list: document.querySelector('.gallery'),
  input: document.querySelector('input[name="searchQuery"]'),
  loadMoreBtn: document.querySelector('.load-more'),
};

// const lightbox = new SimpleLightbox('.photo-card a');

refs.form.addEventListener('submit', handleSubmit);

refs.loadMoreBtn.style.display = 'none';

function handleSubmit(event) {
  event.preventDefault();
  const inputValue = refs.input.value.trim();
  searchImages(inputValue);
  refs.form.reset();
}

async function searchImages(inputValue) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '39851842-1a75475aaeb26e27697c31964',
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    });

    const info = response.data.hits;

    if (info.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createMarkup(info);
    }
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(array) {
  const markup = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>`;
      }
    )
    .join('');

  refs.list.innerHTML = markup;
}
