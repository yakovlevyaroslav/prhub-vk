import '../styles/main.scss';
import './sliders.js';
import './animations.js';
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
import '../assets/stories-preview-image-1.png';
import '../assets/stories-preview-image-2.png';
import '../assets/stories-preview-image-3.png';
import '../assets/stories-preview-image-4.png';

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
import '../assets/image_card-1.jpg';
import '../assets/image_card-2.jpg';
import '../assets/icon_arrow-slider-bubble.svg';
import '../assets/icon_arrow-cursive.svg';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM полностью загружен');
  
  // Инициализация функций скролла
  initAllScrollFunctions();
  
  // Функция для установки позиции градиента относительно блока stories
  function setGradientPosition() {
    const storiesSection = document.querySelector('.stories');
    if (storiesSection) {
      const storiesOffset = storiesSection.getBoundingClientRect().top + window.scrollY;
      document.documentElement.style.setProperty('--stories-offset', `${storiesOffset}px`);
      console.log('Установлена позиция градиента:', storiesOffset);
    }

    const historySection = document.querySelector('.history');
    if (historySection) {
      const historyOffset = historySection.getBoundingClientRect().top + window.scrollY;
      document.documentElement.style.setProperty('--history-offset', `${historyOffset}px`);
      console.log('Установлена позиция градиента:', historyOffset);
    }

    const downloadSection = document.querySelector('.download');
    if (downloadSection) {
      const downloadOffset = downloadSection.getBoundingClientRect().top + window.scrollY;
      document.documentElement.style.setProperty('--download-offset', `${downloadOffset}px`);
      console.log('Установлена позиция градиента:', downloadOffset);
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
