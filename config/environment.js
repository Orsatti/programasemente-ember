/* eslint-env node */
// 'use strict';

module.exports = function(environment) {
  let ENV = {
    adobeApiKey: "40373f2f316448baa8c58aee78276225",
    modulePrefix: 'semente-web-app',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        'ds-improved-ajax': true
      },
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },

    APP: {
      host: 'https://semente-api.azurewebsites.net',
      // host: 'https://sementeapi.minimo.com.br',
      namespace: 'api/v0',
    }
  }

  ENV['ember-simple-auth'] = {
    authorizer: 'authorizer:author',
    crossOriginWhitelist: ['*'],
  }

  if (environment === 'production') {
    ENV.APP.DOMAIN = "programasemente.com.br";
    ENV.APP.host = 'https://semente-api.azurewebsites.net';
    // ENV.APP.host = 'https://sementeapi.minimo.com.br';
  }

  if (environment === 'development') {
    ENV.adobeApiKey = "f04da9781afa4ebf871f5e4566d9bbe9",
    ENV.rootURL = '/';
    ENV.APP.DOMAIN = "porto.com";
    ENV.APP.host = 'https://localhost:44300';
    // ENV.APP.host = 'https://semente-api.azurewebsites.net';
    // ENV.APP.host = 'https://sementeapi.minimo.com.br';
    //  ENV.APP.host = 'http://sementeapidev.minimo.com.br';
  }

  ENV['ember-simple-auth-token'] = {
    serverTokenEndpoint: 'https://semente-api.azurewebsites.net/api/v0/auth/login',
    serverTokenRefreshEndpoint: 'https://semente-api.azurewebsites.net/api/v0/RefreshTokens',
    // serverTokenEndpoint: 'https://sementeapi.minimo.com.br/api/v0/auth/login',
    // serverTokenRefreshEndpoint: 'https://sementeapi.minimo.com.br/api/v0/RefreshTokens',
    identificationField: 'username',
    passwordField: 'password',
    tokenPropertyName: 'token',
    refreshAccessTokens: false,
    authorizationPrefix: 'Bearer ',
    authorizationHeaderName: 'Authorization',
    headers: {},
  }

  return ENV;
};
