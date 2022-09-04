const { map, tap, mergeMap, take } = require('rxjs/operators');
const { timer } = require('rxjs');

const fetch = require('node-fetch');
const { object } = require('rxfire/database');
const { initializeApp } = require('firebase');
require('firebase/database');

const baseUrl = 'https://rockfordkeeper2022-default-rtdb.firebaseio.com';

module.exports.getRoot$ = () => {
  const app = initializeApp({
    apiKey: 'AIzaSyAWYMT1YTd0ETez_F6I8Y6HsbyFhMMcZbA',
    authDomain: 'rockfordkeeper2022.firebaseapp.com',
    databaseUrl: 'https://rockfordkeeper2022-default-rtdb.firebaseio.com',
    projectId: 'rockfordkeeper2022',
    storageBucket: 'rockfordkeeper2022.appspot.com',
    messagingSenderId: '588249551467',
    appId: '1:588249551467:web:58a960aec7419d3c4e572e'
  });

  const root$ = object(app.database().ref());

  // every 6 minutes
  return timer(0, 300000).pipe(
    mergeMap(() => root$.pipe(take(1))),
    map(change => change.snapshot.val())
  )
};

module.exports.writeOwners = async owners => {
  await fetch(`${baseUrl}/owners.json`, {
    method: 'PUT',
    body: JSON.stringify(owners)
  });
};

module.exports.writePlayers = async players => {
  for (const player of players) {
    await fetch(`${baseUrl}/players.json`, {
      method: 'POST',
      body: JSON.stringify(player)
    });
  }
};

module.exports.writePicks = async picks => {
  for (const pick of picks) {
    await fetch(`${baseUrl}/picks/${pick.overallSelection}.json`, {
      method: 'PUT',
      body: JSON.stringify(pick)
    });
  }
};
