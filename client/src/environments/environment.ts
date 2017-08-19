// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA4EzCgL3MDpBq0ja6YbUj5sjhH9P0MgCA',
    authDomain: 'rockfordkeeper.firebaseapp.com',
    databaseURL: 'https://rockfordkeeper.firebaseio.com',
    projectId: 'rockfordkeeper',
    storageBucket: 'rockfordkeeper.appspot.com',
    messagingSenderId: '725670937502'
  }
};
