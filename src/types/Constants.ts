const prod = {
  url: {
    API_URL: 'https://20ef-39-61-50-47.ngrok-free.app',
    API_URL_USERS: 'https://20ef-39-61-50-47.ngrok-free.app/users',
    PAGE_SIZE: 20
  }
};
const dev = {
  url: {
    API_URL: 'https://20ef-39-61-50-47.ngrok-free.app',
    PAGE_SIZE: 20
  }
};
export const configs = process.env.NODE_ENV === 'development' ? dev : prod;