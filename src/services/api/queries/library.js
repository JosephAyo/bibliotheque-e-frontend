import URI_MAP from '../uris';
import { axios, getAuthToken } from '../../../config/axios';
import { getAxiosResponseBody } from 'utils/objects';

export const viewLibrary = async () => {
  const res = await axios.get(`${URI_MAP.library.view()}`, {
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

export const viewLibraryAsManager = async () => {
  const res = await axios.get(`${URI_MAP.library.viewAsManager()}`, {
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

export const searchBooks = async () => {
  const res = await axios.get(`${URI_MAP.library.search()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const searchBooksAsManager = async () => {
  const res = await axios.get(`${URI_MAP.library.searchAsManager()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
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
