/**
 * Обработчик формы истории
 * Включает валидацию полей и отправку формы
 */

// Импортируем библиотеку IMask для создания масок ввода
import IMask from 'imask';

document.addEventListener('DOMContentLoaded', () => {
  // Получаем элементы формы
  const form = document.querySelector('.history__form');
  if (!form) return;

  const nameInput = form.querySelector('#name');
  const meetInput = form.querySelector('#meet');
  const storyInput = form.querySelector('#story');
  const photoInput = form.querySelector('#photo');
  const submitButton = form.querySelector('.history__form-btn');
  const filePreview = form.querySelector('.history__form-file-preview');
  const filePlaceholder = form.querySelector('.history__form-file-placeholder');

  // Создаем маску для поля даты в формате DD.MM.YYYY
  const meetMask = IMask(meetInput, {
    mask: 'DD.MM.YYYY',
    blocks: {
      DD: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2,
        placeholderChar: 'д'
      },
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
        placeholderChar: 'м'
      },
      YYYY: {
        mask: IMask.MaskedRange,
        from: 1900,
        to: 2999,
        placeholderChar: 'г'
      }
    },
    lazy: false,
    overwrite: true
  });

  // Объект для хранения состояния валидации
  const validationState = {
    name: false,
    meet: false,
    story: false,
    photo: false
  };

  // Функция для проверки валидности всех полей
  const checkFormValidity = () => {
    // Убираем блокировку кнопки
    submitButton.classList.remove('btn-disabled');
    submitButton.disabled = false;
  };

  // Функция для валидации имени
  const validateName = () => {
    const value = nameInput.value.trim();
    validationState.name = value.length >= 2;
    
    if (!validationState.name) {
      showError(nameInput, 'Введите корректное имя');
    } else {
      hideError(nameInput);
    }
  };

  // Функция для валидации даты знакомства
  const validateMeet = () => {
    const value = meetInput.value.trim();
    validationState.meet = value.length === 10 && meetMask.masked.isComplete;
    
    if (!validationState.meet) {
      showError(meetInput, 'Укажите дату знакомства в формате ДД.ММ.ГГГГ');
    } else {
      hideError(meetInput);
    }
  };

  // Функция для валидации истории
  const validateStory = () => {
    const value = storyInput.value.trim();
    validationState.story = value.length >= 10;
    
    if (!validationState.story) {
      showError(storyInput, 'Расскажите историю подробнее (минимум 10 символов)');
    } else {
      hideError(storyInput);
    }
  };

  // Функция для валидации фотографий
  const validatePhoto = () => {
    validationState.photo = photoInput.files.length > 0;
    
    if (!validationState.photo) {
      showError(photoInput, 'Добавьте хотя бы одну фотографию');
    } else {
      hideError(photoInput);
    }
  };

  // Функция для отображения ошибки
  const showError = (element, message) => {
    // Удаляем предыдущую ошибку, если она есть
    hideError(element);
    
    // Создаем элемент с ошибкой
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    
    // Добавляем класс с ошибкой к полю ввода
    if (element.type === 'file') {
      // Если это input type="file", добавляем класс к history__form-file-wrapper
      element.closest('.history__form-file-wrapper').classList.add('input-error');
      // Добавляем ошибку на том же уровне, что и history__form-file-wrapper
      element.closest('.history__form-item').appendChild(errorElement);
    } else {
      element.classList.add('input-error');
      element.parentNode.appendChild(errorElement);
    }
  };

  // Функция для скрытия ошибки
  const hideError = (element) => {
    // Удаляем класс с ошибкой
    element.classList.remove('input-error');
    
    // Удаляем элемент с ошибкой, если он есть
    const errorElement = element.parentNode.querySelector('.form-error');
    if (errorElement) {
      errorElement.remove();
    }
  };

  // Обработчик изменения файлов
  const handleFileChange = () => {
    console.log('handleFileChange вызван');
    console.log('Количество файлов:', photoInput.files.length);
    
    // Очищаем превью перед добавлением новых файлов
    filePreview.innerHTML = '';
    console.log('Превью очищено');
    
    if (photoInput.files && photoInput.files.length > 0) {
      filePlaceholder.style.display = 'none';
      
      // Проверяем количество файлов
      if (photoInput.files.length > 4) {
        showError(photoInput, 'Максимальное количество фотографий - 4');
        validationState.photo = false;
        return;
      }
      
      // Если количество файлов валидно, удаляем класс input-error и form-error
      const fileWrapper = photoInput.closest('.history__form-file-wrapper');
      const formItem = fileWrapper.closest('.history__form-item');
      if (fileWrapper) {
        fileWrapper.classList.remove('input-error');
      }
      if (formItem) {
        const formError = formItem.querySelector('.form-error');
        if (formError) {
          formError.remove();
        }
      }
      
      // Проверяем размер и тип файлов
      let hasInvalidFile = false;
      
      // Создаем массив промисов для загрузки файлов
      const loadPromises = Array.from(photoInput.files).map((file, index) => {
        console.log(`Обработка файла ${index + 1}:`, file.name);
        
        return new Promise((resolve, reject) => {
          // Проверяем тип файла
          if (!file.type.startsWith('image/')) {
            showError(photoInput, 'Добавьте только изображения');
            hasInvalidFile = true;
            reject(new Error('Invalid file type'));
            return;
          }
          
          // Проверяем размер файла (максимум 5 МБ)
          if (file.size > 5 * 1024 * 1024) {
            showError(photoInput, 'Размер файла не должен превышать 5 МБ');
            hasInvalidFile = true;
            reject(new Error('File too large'));
            return;
          }
          
          // Создаем превью
          const reader = new FileReader();
          
          reader.onload = function(e) {
            console.log(`Создание превью для файла ${index + 1}`);
            
            // Проверяем, существует ли уже превью для этого файла
            const existingPreview = filePreview.querySelector(`[data-file-name="${file.name}"]`);
            if (existingPreview) {
              console.log(`Превью для файла ${index + 1} уже существует`);
              resolve();
              return;
            }
            
            const previewItem = document.createElement('div');
            previewItem.className = 'history__form-file-preview-item';
            previewItem.dataset.fileName = file.name;
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Превью';
            
            const removeBtn = document.createElement('div');
            removeBtn.className = 'history__form-file-preview-item-remove';
            removeBtn.innerHTML = '×';
            removeBtn.dataset.index = index;
            
            removeBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              previewItem.remove();
              
              // Если все превью удалены, показываем плейсхолдер
              if (filePreview.children.length === 0) {
                filePlaceholder.style.display = 'flex';
                validationState.photo = false;
                // Удаляем класс input-error, так как поле пустое
                const fileWrapper = photoInput.closest('.history__form-file-wrapper');
                if (fileWrapper) {
                  fileWrapper.classList.remove('input-error');
                }
              }
            });
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            filePreview.appendChild(previewItem);
            
            console.log(`Превью для файла ${index + 1} создано`);
            
            resolve();
          };
          
          reader.onerror = function() {
            console.error(`Ошибка загрузки файла ${index + 1}`);
            reject(new Error('Failed to load file'));
          };
          
          reader.readAsDataURL(file);
        });
      });
      
      // Ждем загрузки всех файлов
      Promise.all(loadPromises)
        .then(() => {
          console.log('Все превью загружены');
          if (!hasInvalidFile) {
            validationState.photo = true;
            hideError(photoInput);
          }
        })
        .catch(error => {
          console.error('Error loading files:', error);
        });
    } else {
      filePlaceholder.style.display = 'flex';
      validationState.photo = false;
    }
    console.log('handleFileChange завершен');
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Скрываем все предыдущие ошибки
    hideError(nameInput);
    hideError(meetInput);
    hideError(storyInput);
    hideError(photoInput);
    
    // Проверяем валидность всех полей перед отправкой
    validateName();
    validateMeet();
    validateStory();
    validatePhoto();
    
    // Если есть ошибки, прерываем отправку
    if (!Object.values(validationState).every(value => value === true)) {
      return;
    }
    
    // Создаем объект FormData для отправки
    const formData = new FormData();
    formData.append('name', nameInput.value.trim());
    formData.append('meet', meetInput.value.trim());
    formData.append('story', storyInput.value.trim());
    
    // Добавляем все файлы
    for (let i = 0; i < photoInput.files.length; i++) {
      formData.append('photos', photoInput.files[i]);
    }
    
    // Отключаем кнопку отправки только во время отправки
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    
    try {
      // Здесь должен быть ваш код для отправки данных на сервер
      // Например:
      // const response = await fetch('/api/submit-story', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Имитация отправки (замените на реальный код)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Показываем сообщение об успешной отправке
      showSuccessMessage();
      
      // Сбрасываем форму
      form.reset();
      filePreview.innerHTML = '';
      filePlaceholder.style.display = 'flex';
      
      // Сбрасываем состояние валидации
      Object.keys(validationState).forEach(key => {
        validationState[key] = false;
      });
    } catch (error) {
      // Показываем сообщение об ошибке
      showErrorMessage(error.message || 'Произошла ошибка при отправке формы');
    } finally {
      // Включаем кнопку отправки
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить историю';
    }
  };

  // Функция для отображения сообщения об успешной отправке
  const showSuccessMessage = () => {
    const messageElement = document.createElement('div');
    messageElement.className = 'form-success-message';
    messageElement.textContent = 'Ваша история успешно отправлена!';
    
    form.appendChild(messageElement);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  };

  // Функция для отображения сообщения об ошибке
  const showErrorMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'form-error-message';
    messageElement.textContent = message || 'Произошла ошибка при отправке формы';
    
    form.appendChild(messageElement);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  };

  // Добавляем обработчики событий
  console.log('Добавление обработчика события change для photoInput');
  photoInput.addEventListener('change', handleFileChange);
  
  form.addEventListener('submit', handleSubmit);
  
  // Инициализация состояния кнопки
  checkFormValidity();
}); 