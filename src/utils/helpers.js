import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DUE_DAYS_REMINDER_AT } from './constants';

dayjs.extend(utc);

export const iff = (condition, then, otherwise) => (condition ? then : otherwise);

export const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

export const bookSearch = (books = [], searchText = '') =>
  books.filter(
    (book) =>
      book.title.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
      book.author_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
      book.description.toLowerCase().indexOf(searchText.toLowerCase()) > -1
  );

export const formatDate = (date) => dayjs.utc(date).local().format('DD/MM/YYYY, HH:mm');

export const getDueIndicatorColor = (date) => {
  const daysToDue = dayjs.utc(date).local().diff(dayjs(), 'day', true);

  if (daysToDue <= 0) return 'red';
  if (daysToDue <= DUE_DAYS_REMINDER_AT) return 'yellow';
  return '';
};

const colorPalette = [
  'whiteAlpha',
  'blackAlpha',
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink'
];

export const getGenreNameTagColorScheme = (genreName) => {
  let hash = 0;
  for (let i = 0; i < genreName.length; i += 1) {
    hash += genreName.charCodeAt(i);
  }
  return colorPalette[hash % colorPalette.length];
};
