const prod = {
  url: {
    API_URL: 'https://staging.lln.lcb.mybluehost.me/public',
    API_URL_USERS: 'https://staging.lln.lcb.mybluehost.me/public/users',
    PAGE_SIZE: 20
  }
};
const dev = {
  url: {
    API_URL: 'https://staging.lln.lcb.mybluehost.me/public',
    PAGE_SIZE: 20
  }
};
export const configs = process.env.NODE_ENV === 'development' ? dev : prod;