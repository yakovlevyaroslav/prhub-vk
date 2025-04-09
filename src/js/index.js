import '../styles/main.scss';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import './form-handler.js';

// Импортируем изображения явно, чтобы webpack их включил в сборку
import '../assets/image_card-1.jpg';
import '../assets/image_card-2.jpg';
import '../assets/image_iphone.jpg';
import '../assets/bg_main.jpg';
import '../assets/icon_vk-znakomstva-text.svg';
import '../assets/icon_arrow-slider-bubble.svg';
import '../assets/icon_file.svg';
import '../assets/icon_vk.svg';
import '../assets/icon_arrow-cursive.svg';

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация слайдера историй
  const storiesSlider = new Swiper('.stories__cards', {
    modules: [Navigation],
    slidesPerView: 4,
    spaceBetween: 16,
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
        slidesPerView: 1.2,
        spaceBetween: 12,
      },
      // Когда ширина экрана <= 980px
      481: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      // Когда ширина экрана > 980px
      981: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
    },
    on: {
      // Используем storiesSlider в обработчике события
      slideChange: () => {
        const activeIndex = storiesSlider.activeIndex;
        const slides = storiesSlider.slides;
        slides[activeIndex].classList.add('active');
      },
    },
  });

  // Обработка кнопок "Наверх" в футере
  const scrollToTopBtns = document.querySelectorAll('.footer__content-btn');
  scrollToTopBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  // Инициализация попапа с историями
  const storiesPopup = document.querySelector('.stories-popup');
  const storiesPopupClose = document.querySelector('.stories-popup__close');
  const storiesPopupSlider = document.querySelector('.stories-popup__slider');
  let storiesPopupSwiper = null;

  // Функция для открытия попапа
  function openStoriesPopup(index) {
    // Создаем слайдер, если он еще не создан
    if (!storiesPopupSwiper) {
      storiesPopupSwiper = new Swiper(storiesPopupSlider, {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 0,
        allowTouchMove: true,
        grabCursor: true,
        initialSlide: index,
        autoHeight: false,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        navigation: {
          nextEl: '.stories-popup__slider-button_next',
          prevEl: '.stories-popup__slider-button_prev',
        },
      });
    } else {
      // Если слайдер уже существует, просто переходим к нужному слайду
      storiesPopupSwiper.slideTo(index);
    }

    // Показываем попап
    storiesPopup.classList.add('active');
    document.documentElement.classList.add('popup-open'); // Добавляем класс для блокировки скролла
  }

  // Функция для закрытия попапа
  function closeStoriesPopup() {
    storiesPopup.classList.remove('active');
    document.documentElement.classList.remove('popup-open'); // Удаляем класс для блокировки скролла
  }

  // Обработчик клика по кнопке закрытия
  if (storiesPopupClose) {
    storiesPopupClose.addEventListener('click', closeStoriesPopup);
  }

  // Обработчик клика по оверлею для закрытия попапа
  const storiesPopupOverlay = document.querySelector('.stories-popup__overlay');
  if (storiesPopupOverlay) {
    storiesPopupOverlay.addEventListener('click', closeStoriesPopup);
  }

  // Обработчик клика по кнопкам "Читать историю"
  const storyButtons = document.querySelectorAll('.stories__card-btn');
  if (storyButtons.length > 0) {
    // Собираем данные из всех карточек
    const storiesData = [];
    const storyCards = document.querySelectorAll('.stories__card');

    storyCards.forEach((card, index) => {
      const badge = card.querySelector('.stories__card-badge');
      const badgeType = card.querySelector('.stories__card-badge-type');
      const title = card.querySelector('.stories__card-title');
      const text = card.querySelector('.stories__card-text');
      
      // Получаем фоновое изображение из стилей карточки
      const computedStyle = window.getComputedStyle(card);
      const backgroundImage = computedStyle.backgroundImage;
      
      // Извлекаем URL изображения из строки background-image
      let imageUrl = '';
      if (backgroundImage && backgroundImage !== 'none') {
        // Извлекаем URL из строки вида url("path/to/image.jpg")
        const match = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
          imageUrl = match[1];
          
          // Если путь относительный, преобразуем его в абсолютный
          if (imageUrl.startsWith('../') || imageUrl.startsWith('./') || !imageUrl.startsWith('http')) {
            // Получаем базовый URL текущей страницы
            const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            
            // Преобразуем относительный путь в абсолютный
            if (imageUrl.startsWith('../')) {
              // Удаляем '../' и добавляем базовый URL
              imageUrl = baseUrl + imageUrl.substring(3);
            } else if (imageUrl.startsWith('./')) {
              // Удаляем './' и добавляем базовый URL
              imageUrl = baseUrl + imageUrl.substring(2);
            } else {
              // Просто добавляем базовый URL
              imageUrl = baseUrl + imageUrl;
            }
          }
        }
      }
      
      // Если не удалось получить URL из стилей, используем дефолтное изображение
      if (!imageUrl) {
        imageUrl = require('../assets/image_card-1.jpg');
      }

      storiesData.push({
        badge: badge
          ? badge.textContent.replace(badgeType ? badgeType.textContent : '', '').trim()
          : '',
        badgeType: badgeType ? badgeType.textContent : '',
        image: imageUrl,
        title: title ? title.textContent : '',
        text: text ? text.textContent : '',
      });
    });

    // Создаем слайды для попапа
    const storiesPopupWrapper = document.querySelector('.stories-popup__slider .swiper-wrapper');

    storiesData.forEach((story, index) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      // Добавляем data-атрибут с индексом для отслеживания
      slide.dataset.storyIndex = index;

      slide.innerHTML = `
        <div class="stories-popup__card">
          <div class="stories-popup__card-image">
            <img src="${story.image}" alt="${story.title}">
            <div class="stories-popup__card-info">
              <div class="stories-popup__card-names">
              ${story.title}
              </div>
              <div class="stories-popup__card-badge">
              ${story.badge}
              </div>
              <span class="stories-popup__card-badge-type">${story.badgeType}</span>
            </div>
          </div>
          <div class="stories-popup__card-content">
            <div class="stories-popup__card-title">История любви</div>
            <div class="stories-popup__card-text">${story.text}</div>
          </div>
        </div>
      `;

      storiesPopupWrapper.appendChild(slide);
    });

    // Добавляем обработчики для кнопок
    storyButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Используем index для добавления дополнительной функциональности
        button.setAttribute('data-opened', 'true');
        openStoriesPopup(index);
      });
    });
  }
});
