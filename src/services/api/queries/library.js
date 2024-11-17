import URI_MAP from '../uris';
import { axios, getAuthToken } from '@/config/axios';
import { getAxiosResponseBody } from '@/utils/objects';

export const viewLibrary = async ({ queryKey }) => {
  const [_, filters] = queryKey;
  const queryParams = new URLSearchParams({
    genres: filters.genres.map((item) => item.value).join(',')
  });

  const res = await axios.get(`${URI_MAP.library.view()}?${queryParams.toString()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const viewOneBook = async ({ queryKey }) => {
  const [_, id] = queryKey;

  const res = await axios.get(`${URI_MAP.library.view()}/id/${id}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const createBook = async (data) => {
  const res = await axios.post(`${URI_MAP.library.create()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const editBookDetails = async (data) => {
  const res = await axios.patch(`${URI_MAP.library.editDetails()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const viewLibraryAsManager = async ({ queryKey }) => {
  const [_, filters] = queryKey;
  let queryParams = '';
  if (filters)
    queryParams = new URLSearchParams({
      genres: filters.genres.map((item) => item.value).join(',')
    });

  const res = await axios.get(`${URI_MAP.library.viewAsManager()}?${queryParams.toString()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const deleteBook = async (id) => {
  const res = await axios.delete(`${URI_MAP.library.delete(id)}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const searchBooks = async ({ queryKey }) => {
  const [_, filters] = queryKey;
  const queryParams = new URLSearchParams({
    query: filters.searchText,
    genres: filters.genres.map((item) => item.value).join(',')
  });

  const res = await axios.get(`${URI_MAP.library.search()}?${queryParams.toString()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const searchBooksAsManager = async ({ queryKey }) => {
  const [_, filters] = queryKey;
  const queryParams = new URLSearchParams({
    query: filters.searchText,
    genres: filters.genres.map((item) => item.value).join(',')
  });

  const res = await axios.get(`${URI_MAP.library.searchAsManager()}?${queryParams.toString()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const editQuantity = async (data) => {
  const res = await axios.patch(`${URI_MAP.library.editQuantity()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const viewBorrowedBooks = async () => {
  const res = await axios.get(`${URI_MAP.library.viewBorrowed()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const viewBorrowedBooksAsManager = async ({ queryKey }) => {
  const [_, status] = queryKey;
  const res = await axios.get(
    `${URI_MAP.library.viewBorrowed()}/manager?status=${status || 'all'}`,
    {
      headers: {
        Authorization: getAuthToken()
      }
    }
  );
  return getAxiosResponseBody(res);
};

export const sendBorrowedBookReminder = async (borrowId) => {
  const res = await axios.post(
    `${URI_MAP.library.viewBorrowed()}/manager/${borrowId}`,
    {},
    {
      headers: {
        Authorization: getAuthToken()
      }
    }
  );
  return res;
};

export const borrowBook = async (data) => {
  const res = await axios.put(`${URI_MAP.library.borrow()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const returnBorrowedBook = async (data) => {
  const res = await axios.patch(`${URI_MAP.library.returnBook()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const viewBorrowedBooksReminder = async () => {
  const res = await axios.get(`${URI_MAP.library.viewBorrowed()}/reminders`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};
