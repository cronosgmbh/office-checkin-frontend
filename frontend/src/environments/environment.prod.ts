export const environment = {
  production: true,
  appVersion: require('../../package.json').version + '-cr14',
  api_url: 'https://path.to.api.net/v1',
  firebase: {
    apiKey: 'apiKey',
    authDomain: 'authdomain.firebaseapp.com',
    databaseURL: 'https://databaseURL.firebaseio.com',
    projectId: 'projectid',
    storageBucket: 'storageBucket.appspot.com',
    messagingSenderId: 'messaginSenderId',
    appId: 'appId'
  }
};
