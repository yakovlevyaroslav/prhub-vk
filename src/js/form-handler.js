/**
 * Обработчик формы истории
 * Включает валидацию полей и отправку формы
 *
 * API для отправки данных:
 * - Метод: POST
 * - URL: Хранится в константе VK_URL
 * - Формат данных: FormData (multipart/form-data)
 * - Поля формы: name, meet, story, email, phone, vklink, photos (файлы)
 */

// Импортируем библиотеку IMask для создания масок ввода
import IMask from 'imask';

// URL API для отправки данных с формы
const VK_URL =
  'https://pastebin.mvk.com/d0yyvQVnBQBTuTUWYKFx3cVI1xWOpOIncm2fCqOh59vGFjrdSxtqQlXeLIIUHyH6u8Z8AGpbpzyWANru.nginx';

document.addEventListener('DOMContentLoaded', () => {
  // Получаем элементы формы
  const form = document.querySelector('.history__form');
  if (!form) return;

  const nameInput = form.querySelector('#name');
  const meetInput = form.querySelector('#meet');
  const storyInput = form.querySelector('#story');
  const photoInput = form.querySelector('#photo');
  const emailInput = form.querySelector('#email');
  const phoneInput = form.querySelector('#phone');
  const vklinkInput = form.querySelector('#vklink');
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
        placeholderChar: 'д',
      },
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
        placeholderChar: 'м',
      },
      YYYY: {
        mask: IMask.MaskedRange,
        from: 1900,
        to: 2999,
        placeholderChar: 'г',
      },
    },
    lazy: false,
    overwrite: true,
  });

  // Создаем маску для поля телефона в формате +7 (999) 999-99-99
  const phoneMask = IMask(phoneInput, {
    mask: '+7 (000) 000-00-00',
    lazy: false,
    placeholderChar: '_',
    // Делаем overwrite true, чтобы новые символы заменяли выделенный текст
    overwrite: true,
  });

  // Добавляем CSS для стилизации маски как placeholder
  const maskStyle = document.createElement('style');
  maskStyle.textContent = `
    input.imask-placeholder {
      color: #999 !important;
      opacity: 0.6;
    }
  `;
  document.head.appendChild(maskStyle);

  // Функция для обновления стилей маски
  const updatePhoneMaskStyle = () => {
    if (phoneMask.unmaskedValue === '') {
      // Если значение пустое, делаем маску бледной
      phoneInput.classList.add('imask-placeholder');
    } else {
      // Если есть значение, используем обычный цвет
      phoneInput.classList.remove('imask-placeholder');
    }
  };

  // Инициализируем стиль при загрузке
  updatePhoneMaskStyle();

  // Обновляем стиль при вводе
  phoneInput.addEventListener('input', updatePhoneMaskStyle);

  // Объект для хранения состояния валидации
  const validationState = {
    name: false,
    meet: false,
    story: false,
    photo: false,
    email: false,
    phone: false,
    vklink: false,
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

  // Функция для валидации email
  const validateEmail = () => {
    const value = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    validationState.email = emailRegex.test(value);

    if (!validationState.email) {
      showError(emailInput, 'Введите корректный email');
    } else {
      hideError(emailInput);
    }
  };

  // Функция для валидации телефона
  const validatePhone = () => {
    // const value = phoneInput.value.trim();
    validationState.phone = phoneMask.masked.isComplete;

    if (!validationState.phone) {
      showError(phoneInput, 'Введите корректный номер телефона');
    } else {
      hideError(phoneInput);
    }
  };

  // Функция для валидации ссылки ВКонтакте
  const validateVkLink = () => {
    const value = vklinkInput.value.trim();
    const vkRegex = /^(https?:\/\/)?(www\.)?(vk\.com|vkontakte\.ru)\/.+/i;
    validationState.vklink = vkRegex.test(value);

    if (!validationState.vklink) {
      showError(vklinkInput, 'Введите корректную ссылку на профиль ВКонтакте');
    } else {
      hideError(vklinkInput);
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
    // Очищаем превью перед добавлением новых файлов
    filePreview.innerHTML = '';

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

          reader.onload = function (e) {
            // Проверяем, существует ли уже превью для этого файла
            const existingPreview = filePreview.querySelector(`[data-file-name="${file.name}"]`);
            if (existingPreview) {
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

            removeBtn.addEventListener('click', function (e) {
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

            resolve();
          };

          reader.onerror = function () {
            reject(new Error('Failed to load file'));
          };

          reader.readAsDataURL(file);
        });
      });

      // Ждем загрузки всех файлов
      Promise.all(loadPromises)
        .then(() => {
          if (!hasInvalidFile) {
            validationState.photo = true;
            hideError(photoInput);
          }
        })
        .catch((error) => {
          console.error('Error loading files:', error);
        });
    } else {
      filePlaceholder.style.display = 'flex';
      validationState.photo = false;
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Скрываем все предыдущие ошибки
    hideError(nameInput);
    hideError(meetInput);
    hideError(storyInput);
    hideError(photoInput);
    hideError(emailInput);
    hideError(phoneInput);
    hideError(vklinkInput);

    // Проверяем валидность всех полей перед отправкой
    validateName();
    validateMeet();
    validateStory();
    validatePhoto();
    validateEmail();
    validatePhone();
    validateVkLink();

    // Если есть ошибки, прерываем отправку
    if (!Object.values(validationState).every((value) => value === true)) {
      return;
    }

    // Создаем объект FormData для отправки
    const formData = new FormData();
    formData.append('name', nameInput.value.trim());
    formData.append('meet', meetInput.value.trim());
    formData.append('story', storyInput.value.trim());
    formData.append('email', emailInput.value.trim());
    formData.append('phone', phoneInput.value.trim());
    formData.append('vklink', vklinkInput.value.trim());

    // Добавляем все файлы
    for (let i = 0; i < photoInput.files.length; i++) {
      formData.append('photos', photoInput.files[i]);
    }

    // Отключаем кнопку отправки только во время отправки
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    try {
      // Отправляем данные на сервер, используя VK_URL
      const response = await fetch(VK_URL, {
        method: 'POST',
        body: formData,
        // Не добавляем заголовок Content-Type, т.к. FormData автоматически установит правильный заголовок с boundary
      });

      // Проверяем статус ответа
      if (!response.ok) {
        let errorMessage = 'Произошла ошибка при отправке формы';

        try {
          // Пытаемся получить детали ошибки из тела ответа
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Если не удалось распарсить JSON, используем статус и текст ответа
          errorMessage = `Ошибка: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      let responseData;
      try {
        // Пытаемся прочитать JSON из ответа
        responseData = await response.json();
        console.log('Успешный ответ от сервера:', responseData);
      } catch (e) {
        // Если ответ не в формате JSON, считаем что всё равно успешно
        console.log('Ответ сервера не в формате JSON:', await response.text());
      }

      // Показываем сообщение об успешной отправке
      showSuccessMessage();

      // Сбрасываем форму
      form.reset();
      filePreview.innerHTML = '';
      filePlaceholder.style.display = 'flex';

      // Сбрасываем состояние валидации
      Object.keys(validationState).forEach((key) => {
        validationState[key] = false;
      });
    } catch (error) {
      // Показываем сообщение об ошибке
      showErrorMessage(error.message || 'Произошла ошибка при отправке формы');
      console.error('Ошибка отправки формы:', error);
    } finally {
      // Включаем кнопку отправки
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить';
    }
  };

  // Функция для отображения сообщения об успешной отправке
  const showSuccessMessage = () => {
    // Удаляем предыдущие сообщения об успехе или ошибке, если они есть
    const existingMessages = form.querySelectorAll('.form-success-message, .form-error-message');
    existingMessages.forEach((msg) => msg.remove());

    const messageElement = document.createElement('div');
    messageElement.className = 'form-success-message';
    messageElement.textContent = 'Ваша история успешно отправлена!';

    // Добавляем стили для сообщения об успехе
    messageElement.style.backgroundColor = '#e6f7e6';
    messageElement.style.color = '#1e7e34';
    messageElement.style.padding = '15px';
    messageElement.style.margin = '15px 0';
    messageElement.style.borderRadius = '5px';
    messageElement.style.borderLeft = '5px solid #1e7e34';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.textAlign = 'center';

    form.appendChild(messageElement);

    // Прокручиваем к сообщению
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  };

  // Функция для отображения сообщения об ошибке
  const showErrorMessage = (message) => {
    // Удаляем предыдущие сообщения об успехе или ошибке, если они есть
    const existingMessages = form.querySelectorAll('.form-success-message, .form-error-message');
    existingMessages.forEach((msg) => msg.remove());

    const messageElement = document.createElement('div');
    messageElement.className = 'form-error-message';
    messageElement.textContent = message || 'Произошла ошибка при отправке формы';

    // Добавляем стили для сообщения об ошибке
    messageElement.style.backgroundColor = '#f8d7da';
    messageElement.style.color = '#721c24';
    messageElement.style.padding = '15px';
    messageElement.style.margin = '15px 0';
    messageElement.style.borderRadius = '5px';
    messageElement.style.borderLeft = '5px solid #721c24';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.textAlign = 'center';

    form.appendChild(messageElement);

    // Прокручиваем к сообщению
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  };

  // Добавляем обработчики событий
  photoInput.addEventListener('change', handleFileChange);

  // Добавляем обработчики событий для новых полей
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  vklinkInput.addEventListener('blur', validateVkLink);

  form.addEventListener('submit', handleSubmit);

  // Инициализация состояния кнопки
  checkFormValidity();
});
