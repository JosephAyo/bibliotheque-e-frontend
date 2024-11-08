import URI_MAP from '../uris';
import { axios, getAuthToken } from '@/config/axios';
import { getAxiosResponseBody } from '@/utils/objects';

export const viewGenres = async () => {
  const res = await axios.get(`${URI_MAP.library.genres()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const createGenre = async (data) => {
  const res = await axios.post(`${URI_MAP.library.genres()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const editGenre = async (data) => {
  const res = await axios.patch(`${URI_MAP.library.genres()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};
