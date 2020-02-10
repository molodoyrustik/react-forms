import axios from 'axios';

const API_HOST = 'http://localhost:5000';

export function signup(data) {
  return axios.post(`${API_HOST}/signup`, data).then(r => r.data);
}

export function validateEmail(email) {
  return axios.post(`${API_HOST}/validate/email`, { email }).then(r => r.data);
}
