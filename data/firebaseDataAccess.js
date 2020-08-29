const { map, tap, mergeMap, take } = require('rxjs/operators');
const { timer } = require('rxjs');

const fetch = require('node-fetch');
const { object } = require('rxfire/database');
const { database, initializeApp } = require('firebase');
require('firebase/database');

const baseUrl = 'https://rockfordkeeper2019.firebaseio.com';


module.exports.getRoot$ = () => {
  const app = initializeApp({
    apiKey: 'AIzaSyApNhF0Vkq2_Zg_8LUNbRj2qYlz6otG0NA',
    authDomain: 'rockfordkeeper2019.firebaseapp.com',
    databaseURL: 'https://rockfordkeeper2019.firebaseio.com',
    projectId: 'rockfordkeeper2019',
    storageBucket: '',
    messagingSenderId: '14816530961',
    appId: '1:14816530961:web:b23bc1076aa186a1'
  });

  const root$ = object(app.database().ref());

  // every 6 minutes
  return timer(0, 360000).pipe(
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