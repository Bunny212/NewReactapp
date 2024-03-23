import { ConfigHeaders } from '../types/interfaces';

export const authHeader = (getState: Function, params: any = '') => {
  // Get token from localstorage
  // const token = getState().auth.token;
  const token = localStorage.getItem('token');

  // Headers
  const config: ConfigHeaders = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  // If token, add to headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If params, add to request
  if (params) {
    config.params = params;
  }

  return config;
};

export default authHeader;
