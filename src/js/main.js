import imagesTpl from '../templates/photo-card.hbs'
import refs from './refs'
import ImgApiService from './apiService'

import * as basicLightbox from 'basiclightbox'
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error, notice } from '@pnotify/core';

const { searchForm, imagesContainer, sentinel } = refs
const imgApiService = new ImgApiService();


searchForm.addEventListener('submit', onSearch)
imagesContainer.addEventListener('click', onGalleryOfImagesClick)


function onSearch(e) {
    e.preventDefault();
    
    imgApiService.query = e.currentTarget.elements.query.value

    if (imgApiService.query === '') {
        return  notice({
            text: 'Please, enter the word',
            delay: 1500
        });
    }

    imgApiService.resetPages()
    clearImagesContainer()
    fetchImgs()
}

async function fetchImgs() {
    const hits = await imgApiService.fetchImages()
    appendImgMarkup(hits);

    // without async/await
    // imgApiService.fetchImages().then(hits => {
        //     appendImgMarkup(hits);
        //     loadMoreBtn.enable();
        // })
    }
    
    function appendImgMarkup(hits) {
        imagesContainer.insertAdjacentHTML('beforeend', imagesTpl(hits));
    }
    
    function clearImagesContainer() {
        imagesContainer.innerHTML = ''
    }
    
    function onGalleryOfImagesClick(e) {
        e.preventDefault();
        if (e.target.nodeName !== "IMG") {
            return;
        }
        const bigImgURL = e.target.getAttribute('data-src')
        const instance = basicLightbox.create(`<img width="1400" height="900" src= ${bigImgURL}>`)
        instance.show()
}


const onEntry = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && imgApiService.query !== "") {
            imgApiService.fetchImages().then(hits => {
            appendImgMarkup(hits);
        })
        }
    })
}

const options = {
    rootMargin: '150px',
}
    
const observer = new IntersectionObserver(onEntry, options);
observer.observe(sentinel)