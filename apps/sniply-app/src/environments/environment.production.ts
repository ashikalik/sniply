export const environment = {
  production: true,
  api: {
    authBaseUrl: 'http://sniply.kodothgroup.com/auth',
    baseUrl: 'http://sniply.kodothgroup.com/server',
    linkBaseUrl: 'http://sniply.kodothgroup.com/server',
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
    websiteLoginUrl: 'http://sniply.kodothgroup.com/website/login',
  },
};
