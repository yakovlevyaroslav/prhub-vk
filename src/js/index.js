import '../styles/main.scss';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

// Импортируем изображения явно, чтобы webpack их включил в сборку
import '../assets/image_card.jpg';
import '../assets/image_iphone.jpg';
import '../assets/bg_main.jpg';
import '../assets/icon_vk-znakomstva-text.svg';
import '../assets/icon_arrow-slider-bubble.svg';
import '../assets/icon_file.svg';
import '../assets/icon_vk.svg';
import '../assets/icon_arrow-cursive.svg';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Application started');
  
  // Инициализация слайдера историй
  const storiesSlider = new Swiper('.stories__cards', {
    modules: [Navigation],
    slidesPerView: 3,
    spaceBetween: 20,
    autoHeight: false,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    navigation: {
      nextEl: '.stories__slider-button_next',
      prevEl: '.stories__slider-button_prev',
    },
    breakpoints: {
      // Когда ширина экрана <= 480px
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      },
      // Когда ширина экрана <= 980px
      481: {
        slidesPerView: 2,
        spaceBetween: 25
      },
      // Когда ширина экрана > 980px
      981: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    }
  });
  
  // Обработка загрузки файлов
  const fileInput = document.getElementById('photo');
  const filePreview = document.querySelector('.history__form-file-preview');
  const filePlaceholder = document.querySelector('.history__form-file-placeholder');
  
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      
      filePreview.innerHTML = '';
      
      if (this.files && this.files.length > 0) {
        filePlaceholder.style.display = 'none';
        
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
              const previewItem = document.createElement('div');
              previewItem.className = 'history__form-file-preview-item';
              
              const img = document.createElement('img');
              img.src = e.target.result;
              img.alt = 'Превью';
              
              const removeBtn = document.createElement('div');
              removeBtn.className = 'history__form-file-preview-item-remove';
              removeBtn.innerHTML = '×';
              removeBtn.dataset.index = i;
              
              removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                previewItem.remove();
                
                // Если все превью удалены, показываем плейсхолдер
                if (filePreview.children.length === 0) {
                  filePlaceholder.style.display = 'flex';
                }
              });
              
              previewItem.appendChild(img);
              previewItem.appendChild(removeBtn);
              filePreview.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
          }
        }
      } else {
        filePlaceholder.style.display = 'flex';
      }
    });
  }

  // Обработка кнопки "Наверх" в футере
  const scrollToTopBtn = document.querySelector('.footer__content-btn');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}); 