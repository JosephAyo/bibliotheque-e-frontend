import URI_MAP from '../uris';
import { axios, getAuthToken } from '@/config/axios';
import { getAxiosResponseBody } from '@/utils/objects';

export const viewOneCuration = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const res = await axios.get(`${URI_MAP.library.curations()}/${id}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const viewCurations = async () => {
  const res = await axios.get(`${URI_MAP.library.curations()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return getAxiosResponseBody(res);
};

export const createCuration = async (data) => {
  const res = await axios.post(`${URI_MAP.library.curations()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const editCuration = async (data) => {
  const res = await axios.put(`${URI_MAP.library.curations()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};
