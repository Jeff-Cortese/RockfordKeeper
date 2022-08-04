const { map, tap, mergeMap, take } = require('rxjs/operators');
const { timer } = require('rxjs');

const fetch = require('node-fetch');
const { object } = require('rxfire/database');
const { initializeApp } = require('firebase');
require('firebase/database');

const baseUrl = 'https://rockfordkeeper2021-default-rtdb.firebaseio.com';

module.exports.getRoot$ = () => {
  const app = initializeApp({
    apiKey: "AIzaSyBrjCUKzkL-Rjn9AthTPKMYmImKyH2ZYyE",
    authDomain: "rockfordkeeper2021.firebaseapp.com",
    databaseURL: "https://rockfordkeeper2021-default-rtdb.firebaseio.com",
    projectId: "rockfordkeeper2021",
    storageBucket: "rockfordkeeper2021.appspot.com",
    messagingSenderId: "1039162262304",
    appId: "1:1039162262304:web:5f9d216ffb6e514d28cd45"
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
