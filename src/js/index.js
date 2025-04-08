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
        spaceBetween: 10,
      },
      // Когда ширина экрана <= 980px
      481: {
        slidesPerView: 2,
        spaceBetween: 25,
      },
      // Когда ширина экрана > 980px
      981: {
        slidesPerView: 3,
        spaceBetween: 40,
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

  // Обработка загрузки файлов
  const fileInput = document.getElementById('photo');
  const filePreview = document.querySelector('.history__form-file-preview');
  const filePlaceholder = document.querySelector('.history__form-file-placeholder');

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      filePreview.innerHTML = '';

      if (this.files && this.files.length > 0) {
        filePlaceholder.style.display = 'none';

        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];

          if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
              const previewItem = document.createElement('div');
              previewItem.className = 'history__form-file-preview-item';

              const img = document.createElement('img');
              img.src = e.target.result;
              img.alt = 'Превью';

              const removeBtn = document.createElement('div');
              removeBtn.className = 'history__form-file-preview-item-remove';
              removeBtn.innerHTML = '×';
              removeBtn.dataset.index = i;

              removeBtn.addEventListener('click', function (e) {
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
    scrollToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

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
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
  }

  // Функция для закрытия попапа
  function closeStoriesPopup() {
    storiesPopup.classList.remove('active');
    document.body.style.overflow = ''; // Разблокируем скролл страницы
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

    storyCards.forEach((card) => {
      const badge = card.querySelector('.stories__card-badge');
      const badgeType = card.querySelector('.stories__card-badge-type');
      const image = card.querySelector('.stories__card-image img');
      const title = card.querySelector('.stories__card-title');
      const text = card.querySelector('.stories__card-text');

      storiesData.push({
        badge: badge
          ? badge.textContent.replace(badgeType ? badgeType.textContent : '', '').trim()
          : '',
        badgeType: badgeType ? badgeType.textContent : '',
        image: image ? image.src : '',
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
            <div class="stories-popup__card-title">История любви ${index + 1}</div>
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
        button.textContent = `История ${index + 1}`;
        openStoriesPopup(index);
      });
    });
  }
});
