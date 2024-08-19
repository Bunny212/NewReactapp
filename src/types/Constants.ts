const prod = {
  url: {
    
    // API_URL: 'https://2fd82c9861.nxcli.io/sdi-api',
    // https://2fd82c9861.nxcli.io/sdi-api-latest


    // https://sdipschedule.com/api
    
    API_URL: 'https://test.sdipschedule.com/api',
    API_URL_USERS: 'https://test.sdipschedule.com/api/users',
    PAGE_SIZE: 20
  }
};
const dev = {
  url: {
    API_URL: 'https://test.sdipschedule.com/api',
    PAGE_SIZE: 20
  }
};
export const configs = process.env.NODE_ENV === 'development' ? dev : prod;