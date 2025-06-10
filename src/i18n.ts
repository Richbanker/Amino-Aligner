import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "input_label_1": "Sequence 1",
      "input_label_2": "Sequence 2",
      "submit": "Visualize Alignment",
      "theme": "Theme",
      "language": "Language",
      "copied": "Copied!",
      "required": "required",
      "invalid_chars": "contains invalid characters",
      "lengths_must_match": "Sequences must be of equal length",
  
    }
  },
  ru: {
    translation: {
      "input_label_1": "Последовательность 1",
      "input_label_2": "Последовательность 2",
      "submit": "Визуализировать выравнивание",
      "theme": "Тема",
      "language": "Язык",
      "copied": "Скопировано!",
      "required": "обязательное поле",
      "invalid_chars": "содержит недопустимые символы",
      "lengths_must_match": "Длины последовательностей должны совпадать",
  
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 