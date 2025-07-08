import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// Attach JWT token (if any) to all requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
// This code sets up an Axios instance for making API requests.
// It configures the base URL for the API and ensures that cookies are sent with requests.
// Additionally, it attaches a JWT token from local storage to the Authorization header of each request, if available.
// This is useful for authenticated requests to the backend server.

// Usage example:
// import API from './api/axios';
// API.get('/endpoint')
//   .then(response => console.log(response.data))
//   .catch(error => console.error('Error fetching data:', error));

// Note: Make sure to set the REACT_APP_API_URL environment variable in your .env file to point to your backend server.
// Example: REACT_APP_API_URL=http://localhost:5000/api
// This allows the React app to communicate with the backend API seamlessly.