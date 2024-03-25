const prod = {
  url: {
    API_URL: 'https://9d8d4152b6.nxcli.io/sdi-api',
    API_URL_USERS: 'https://9d8d4152b6.nxcli.io/sdi-api/users',
    PAGE_SIZE: 20
  }
};
const dev = {
  url: {
    API_URL: 'https://9d8d4152b6.nxcli.io/sdi-api',
    PAGE_SIZE: 20
  }
};
export const configs = process.env.NODE_ENV === 'development' ? dev : prod;