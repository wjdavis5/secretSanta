export const environment = {
  production: false,
  apiUrl: 'http://localhost:8787/',
  uiUrl: 'http://localhost:4200/',
  auth0: {
    "domain": "secretsantaapp.us.auth0.com",
    "clientId": "K2Jp3NvKHXNpMbcfJNpdPxeQ9MorcckQ",
    "authorizationParams": {
      "audience": "{yourApiIdentifier}"
    },
    "apiUri": "http://localhost:3001",
    "appUri": "http://localhost:4200",
    "errorPath": "/error"
  }

}
