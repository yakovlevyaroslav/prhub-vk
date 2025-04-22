// Инициализация и обработка скролла
export function initScrollToTop() {
  const scrollToTopBtns = document.querySelectorAll('.footer__content-btn');
  scrollToTopBtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  });
}

// Плавный скролл к указанному элементу по клику на якорные ссылки
export function initSmoothScrolling() {
  // Находим все элементы с data-anchor атрибутом
  const anchorButtons = document.querySelectorAll('[data-anchor]');

  if (anchorButtons.length > 0) {
    // Добавляем обработчик события для каждой кнопки
    anchorButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
        e.preventDefault();

        // Получаем значение атрибута data-anchor (имя секции)
        const targetId = this.getAttribute('data-anchor');

        // Находим целевую секцию по классу
        const targetElement = document.querySelector(`.${targetId}`);

        if (targetElement) {
          // Вычисляем позицию элемента относительно верха страницы
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset;

          // Скроллим к элементу
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        } else {
        }
      });
    });
  } else {
  }
}

// Инициализация всех функций скролла
export function initAllScrollFunctions() {
  initScrollToTop();
  initSmoothScrolling();
}

// Инициализируем функции сразу при загрузке скрипта,
// а не только при DOMContentLoaded, чтобы избежать проблем с порядком выполнения
export default initAllScrollFunctions;
