import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DUE_DAYS_REMINDER_AT, DUE_STATUSES } from './constants';

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

export const formatDate = (date) => dayjs.utc(date).local().format('YYYY-MMM-DD, HH:mm');

export const getDueStatus = (date) => {
  const daysToDue = dayjs.utc(date).local().diff(dayjs(), 'day', true);

  if (daysToDue <= 0) return DUE_STATUSES.LATE;
  if (daysToDue <= DUE_DAYS_REMINDER_AT) return DUE_STATUSES.DUE_SOON;
  return DUE_STATUSES.OKAY;
};

export const getDueIndicatorColor = (status) => {
  switch (status) {
    case DUE_STATUSES.LATE:
      return 'red';

    case DUE_STATUSES.DUE_SOON:
      return 'orange';

    case DUE_STATUSES.OKAY:
    default:
      return '';
  }
};

export const getDueStatusAndColor = (date) => {
  const status = getDueStatus(date);
  const color = getDueIndicatorColor(status);

  return {
    status,
    color
  };
};

const colorPalette = [
  'yellow',
  'purple',
  'red',
  'teal',
  'gray',
  'pink',
  'orange',
  'green',
  'cyan',
  'blue'
];

export const getTagBadgeColorScheme = (key) => {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash += key.charCodeAt(i);
  }
  return colorPalette[hash % colorPalette.length];
};

export function clampText(text, limit) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}
