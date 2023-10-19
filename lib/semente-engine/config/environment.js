/*jshint node:true*/
'use strict';

module.exports = function(environment) {
  var ENV = {
    adobeApiKey: "ddf4956ae0d34fafad43bfebe86c96a6",
    // adobeApiKey: "40373f2f316448baa8c58aee78276225",
    modulePrefix: 'semente-engine',
    environment: environment,
    rootURL: '/',
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

  return ENV;
};
