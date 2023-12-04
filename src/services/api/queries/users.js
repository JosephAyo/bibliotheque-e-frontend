import URI_MAP from '../uris';
import { axios, getAuthToken } from '@/config/axios';

export const signup = async (data) => {
  const res = await axios.post(`${URI_MAP.users.signup()}`, JSON.stringify(data));
  return res;
};

export const verifyEmail = async (data) => {
  const res = await axios.patch(`${URI_MAP.users.verifyEmail()}`, JSON.stringify(data));
  return res;
};

export const resendVerificationEmail = async (data) => {
  const res = await axios.post(`${URI_MAP.users.resendVerificationEmail()}`, JSON.stringify(data));
  return res;
};

export const login = async (data) => {
  const res = await axios.post(`${URI_MAP.users.login()}`, JSON.stringify(data));
  return res;
};

export const forgotPassword = async (data) => {
  const res = await axios.patch(`${URI_MAP.users.forgotPassword()}`, JSON.stringify(data));
  return res;
};

export const resetPassword = async (data) => {
  const res = await axios.patch(`${URI_MAP.users.resetPassword()}`, JSON.stringify(data));
  return res;
};

export const changePassword = async (data) => {
  const res = await axios.patch(`${URI_MAP.users.changePassword()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const viewProfile = async () => {
  const res = await axios.get(`${URI_MAP.users.profile.view()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const editProfile = async (data) => {
  const res = await axios.patch(`${URI_MAP.users.profile.edit()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const viewRoles = async () => {
  const res = await axios.get(`${URI_MAP.users.roles.view()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const regulateManager = async (data) => {
  const res = await axios.post(`${URI_MAP.users.regulate()}`, JSON.stringify(data), {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};

export const viewAll = async () => {
  const res = await axios.get(`${URI_MAP.users.viewAll()}`, {
    headers: {
      Authorization: getAuthToken()
    }
  });
  return res;
};
