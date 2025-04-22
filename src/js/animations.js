/**
 * Анимации на основе GSAP
 * Этот файл можно отключить, закомментировав импорт в index.js
 */
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
  // Функция для инициализации анимации иконок
  function initIconsAnimation(icons, isBackgroundIcon) {
    // Устанавливаем начальное состояние
    gsap.set(icons, { 
      opacity: 0,
      scale: 0.5
    });
    
    // Анимация появления
    return gsap.to(icons, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)",
      paused: true, // Анимация на паузе, запустится при скролле
      onComplete: () => {
        // Добавляем плавающую анимацию для каждой иконки после появления
        icons.forEach((icon, index) => {
          // Для фоновой иконки отдельная анимация
          if (isBackgroundIcon && icon.classList.contains('stories__content-title-icon_4')) {
            gsap.to(icon, {
              scale: 1.05,
              rotation: 1,
              duration: 8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          } else {
            // Создаем разные анимации для каждой иконки
            gsap.to(icon, {
              y: index % 2 === 0 ? '10px' : '-10px',
              x: index % 3 === 0 ? '5px' : '-5px',
              rotation: index % 2 === 0 ? 3 : -3,
              duration: 2 + index * 0.3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });            
          }
        });
      }
    });
  }

  // Анимация для иконок на стартовом экране
  const startSection = document.querySelector('.start');
  const startIcons = document.querySelectorAll('.start__image-icon');
  
  if (startSection && startIcons.length > 0) {
    const startAnimation = initIconsAnimation(startIcons, false);
    
    // Создаем наблюдатель за стартовой секцией
    const startObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimation.play();
          startObserver.unobserve(entry.target); // Отключаем наблюдатель после срабатывания
        }
      });
    }, { threshold: 0.3 }); // Запустить когда 30% секции видно
    
    startObserver.observe(startSection);
  }

  // Анимация для иконок в секции stories
  const storiesSection = document.querySelector('.stories__content-title');
  const storiesIcons = document.querySelectorAll('.stories__content-title-icon');
  
  if (storiesSection && storiesIcons.length > 0) {
    const storiesAnimation = initIconsAnimation(storiesIcons, true);
    
    // Создаем наблюдатель за секцией stories
    const storiesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          storiesAnimation.play();
          storiesObserver.unobserve(entry.target); // Отключаем наблюдатель после срабатывания
        }
      });
    }, { threshold: 0.3 }); // Запустить когда 30% секции видно
    
    storiesObserver.observe(storiesSection);
  }
  
  // Анимация для иконок в секции history
  const historySection = document.querySelector('.history__content-left');
  const historyIcons = document.querySelectorAll('.history__images-img');
  
  if (historySection && historyIcons.length > 0) {
    const historyAnimation = initIconsAnimation(historyIcons, false);
    
    // Создаем наблюдатель за секцией history
    const historyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          historyAnimation.play();
          historyObserver.unobserve(entry.target); // Отключаем наблюдатель после срабатывания
        }
      });
    }, { threshold: 0.3 }); // Запустить когда 30% секции видно
    
    historyObserver.observe(historySection);
  }
}); 