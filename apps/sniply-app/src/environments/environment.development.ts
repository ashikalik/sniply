export const environment = {
  production: false,
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
    qrCodesCreate: '/qr-codes/create',
    qrCodesRead: '/qr-codes/read',
    qrCodesList: '/qr-codes/list',
    qrCodesDelete: '/qr-codes/delete',
    qrCodesAnalyticsPrefix: '/qr-codes',
  },
  apps: {
    websiteLoginUrl: 'http://localhost:4200/login',
  },
};
