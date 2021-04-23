// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:3000/v1',
  appVersion: require('../../package.json').version + '-cronos-dev',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
