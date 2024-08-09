const prod = {
  url: {
    
    // API_URL: 'https://2fd82c9861.nxcli.io/sdi-api',
    // https://2fd82c9861.nxcli.io/sdi-api-latest






    API_URL: 'https://2fd82c9861.nxcli.io/sdi-api-latest/',
    API_URL_USERS: 'https://2fd82c9861.nxcli.io/sdi-api-latest/users',
    PAGE_SIZE: 20
  }
};
const dev = {
  url: {
    API_URL: 'https://2fd82c9861.nxcli.io/sdi-api-latest',
    PAGE_SIZE: 20
  }
};
export const configs = process.env.NODE_ENV === 'development' ? dev : prod;