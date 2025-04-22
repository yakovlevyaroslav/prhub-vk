import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация слайдера с миниатюрами (верхний слайдер)
  const thumbsSlider = new Swiper('.stories__slider-previews_cards', {
    modules: [Navigation],
    spaceBetween: 16,
    watchSlidesProgress: true, // Важно для работы в качестве thumbs
    slideToClickedSlide: true, // Переход на слайд при клике
    slidesPerView: 'auto', // Автоматическое определение количества слайдов
    // Устанавливаем CSS-переменную для ширины слайда
    on: {
      init: function () {
        document.documentElement.style.setProperty('--thumb-slide-width', '82px');
      },
    },
  });

  // Инициализация главного слайдера с карточками
  const mainSlider = new Swiper('.stories__cards', {
    modules: [Navigation, Thumbs],
    slidesPerView: 1, // Всегда показываем только 1 слайд
    spaceBetween: 30,
    loopAdditionalSlides: 2,
    grabCursor: true,
    navigation: {
      nextEl: '.stories__slider-button_next',
      prevEl: '.stories__slider-button_prev',
    },
    thumbs: {
      swiper: thumbsSlider, // Связываем с верхним слайдером
      slideThumbActiveClass: 'stories__slider-previews-card-active',
    },
    // Удаляем breakpoints для slidesPerView, чтобы всегда был только 1 слайд
    breakpoints: {
      // Настройки только для spaceBetween
      320: {
        spaceBetween: 12,
      },
      641: {
        spaceBetween: 16,
      },
      981: {
        spaceBetween: 16,
      },
    },
  });

  // Добавляем дополнительную логику для синхронизации активного слайда в thumbs
  mainSlider.on('slideChange', function () {
    const activeIndex = mainSlider.realIndex;
    if (thumbsSlider.slides.length > 0 && thumbsSlider.activeIndex !== activeIndex) {
      thumbsSlider.slideTo(activeIndex);
    }
  });

  // Инициализация попапа с полным просмотром историй
  const initStoryPopup = () => {
    // Находим все кнопки "Читать полностью"
    const storyButtons = document.querySelectorAll('.stories__card-btn');

    if (storyButtons.length > 0) {
      const storiesPopup = document.querySelector('.stories-popup');
      const storiesPopupClose = document.querySelector('.stories-popup__close');
      const storiesPopupSlider = document.querySelector('.stories-popup__slider');

      if (storiesPopup && storiesPopupSlider) {
        let popupSwiper = null;

        // Функция для открытия попапа
        const openStoriesPopup = (index) => {
          if (!popupSwiper) {
            popupSwiper = new Swiper(storiesPopupSlider, {
              modules: [Navigation],
              slidesPerView: 1,
              spaceBetween: 0,
              initialSlide: index,
              navigation: {
                nextEl: '.stories-popup__slider-button_next',
                prevEl: '.stories-popup__slider-button_prev',
              },
            });
          } else {
            popupSwiper.slideTo(index, 0);
          }

          // Показываем попап
          storiesPopup.classList.add('active');
          document.documentElement.classList.add('popup-open');
        };

        // Функция для закрытия попапа
        const closeStoriesPopup = () => {
          storiesPopup.classList.remove('active');
          document.documentElement.classList.remove('popup-open');
        };

        // Добавляем обработчики для кнопок и закрытия
        storyButtons.forEach((button, index) => {
          button.addEventListener('click', () => {
            openStoriesPopup(index);
          });
        });

        if (storiesPopupClose) {
          storiesPopupClose.addEventListener('click', closeStoriesPopup);
        }

        const storiesPopupOverlay = document.querySelector('.stories-popup__overlay');
        if (storiesPopupOverlay) {
          storiesPopupOverlay.addEventListener('click', closeStoriesPopup);
        }
      }
    }
  };

  // Инициализация popup с полным просмотром
  initStoryPopup();
});

export {};
