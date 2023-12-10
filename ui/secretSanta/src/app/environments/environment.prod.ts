export const environment = {
  production: true,
  apiUrl: 'https://secretsanta.wjd5.workers.dev/',
  uiUrl: 'https://secretsanta-9qb.pages.dev/',
  auth0: {
    domain: "secretsantaapp.us.auth0.com",
    clientId: "K2Jp3NvKHXNpMbcfJNpdPxeQ9MorcckQ",
    redirectUri: "https://secretsanta-9qb.pages.dev/callback",
    authorizationParams: {
      audience: "{yourApiIdentifier}"
    },
    apiUri: "http://localhost:3001",
    appUri: "https://localhost:4200",
    errorPath: "/error"
  }
}
