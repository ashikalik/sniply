export const environment = {
  production: true,
  api: {
    authBaseUrl: 'http://localhost:3000',
    baseUrl: 'http://localhost:3001',
    linkBaseUrl: 'http://localhost:3001',
  },
  endpoints: {
    linksCreate: '/links/create',
    linksRead: '/links/read',
    linksList: '/list-links',
    linksDelete: '/links/delete',
    linksAnalyticsPrefix: '/links',
  },
  apps: {
    websiteLoginUrl: 'http://localhost:4200/login',
  },
};
