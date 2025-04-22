import '../styles/main.scss';
import './sliders.js';
import './animations.js';
// import './form-handler--test.js';
import './form-handler.js';
import initAllScrollFunctions from './scrolls.js';

// Импортируем изображения явно, чтобы webpack их включил в сборку
// main section images
import '../assets/icon_vk-znakomstva-text.svg';
import '../assets/main-image.png';
import '../assets/main-3d-icon-1.png';
import '../assets/main-3d-icon-2.png';
import '../assets/main-3d-icon-3.png';

// stories section images
import '../assets/match-icon-1.png';
import '../assets/match-icon-2.png';
import '../assets/match-icon-3.png';
import '../assets/match-icon-4.svg';

import '../assets/couples/stories-image-1--preview.png';
import '../assets/couples/stories-image-2--preview.png';
import '../assets/couples/stories-image-3--preview.png';
import '../assets/couples/stories-image-4--preview.png';
import '../assets/couples/stories-image-5--preview.png';
import '../assets/couples/stories-image-6--preview.png';
import '../assets/couples/stories-image-7--preview.png';
import '../assets/couples/stories-image-8--preview.png';
import '../assets/couples/stories-image-9--preview.png';
import '../assets/couples/stories-image-10--preview.png';

import '../assets/couples/stories-image-1.jpg';
import '../assets/couples/stories-image-2.jpg';
import '../assets/couples/stories-image-3.jpg';
import '../assets/couples/stories-image-4.jpg';
import '../assets/couples/stories-image-5.jpg';
import '../assets/couples/stories-image-6.jpg';
import '../assets/couples/stories-image-7.jpg';
import '../assets/couples/stories-image-8.jpg';
import '../assets/couples/stories-image-9.jpg';
import '../assets/couples/stories-image-10.jpg';


// history section images
import '../assets/history-3d-icon-1.png';
import '../assets/history-3d-icon-2.png';
import '../assets/history-3d-icon-3.svg';
import '../assets/icon_file.svg';

// download section images
import '../assets/icon_share.svg';

// footer section images
import '../assets/icon_vk.svg';
import '../assets/icon_tg.svg';

// other images
import '../assets/icon_arrow-slider-bubble.svg';
import '../assets/icon_arrow-cursive.svg';

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация функций скролла
  initAllScrollFunctions();

  // Функция для установки позиции градиента относительно блока stories
  function setGradientPosition() {
    const storiesSection = document.querySelector('.stories');
    if (storiesSection) {
      const storiesOffset = storiesSection.getBoundingClientRect().top + window.scrollY;
      document.documentElement.style.setProperty('--stories-offset', `${storiesOffset}px`);
    }

    const historySection = document.querySelector('.history');
    if (historySection) {
      const historyOffset = historySection.getBoundingClientRect().top + window.scrollY;
      document.documentElement.style.setProperty('--history-offset', `${historyOffset}px`);
    }

    const downloadSection = document.querySelector('.download');
    if (downloadSection) {
      const downloadOffset = downloadSection.getBoundingClientRect().top + window.scrollY;
      document.documentElement.style.setProperty('--download-offset', `${downloadOffset}px`);
    }
  }

  // Устанавливаем начальную позицию
  setGradientPosition();

  // Обновляем позицию при изменении размера окна
  window.addEventListener('resize', setGradientPosition);

  // Обновляем позицию при прокрутке (опционально, если содержимое страницы может менять расположение)
  window.addEventListener('scroll', () => {
    // Используем requestAnimationFrame для оптимизации производительности
    requestAnimationFrame(setGradientPosition);
  });
});
