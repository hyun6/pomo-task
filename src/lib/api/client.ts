import axios from 'axios';

const client = axios.create({
  withCredentials: true,
});

const apiServerDomain = 'localhost';
client.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/' : apiServerDomain;

export default client;
