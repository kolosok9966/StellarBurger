import { checkResponse } from './checkResponse';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function request(endpoint, options) {
  return fetch(`${API_BASE_URL}${endpoint}`, options).then(checkResponse);
}
