const { map, tap, mergeMap, take } = require('rxjs/operators');
const { timer } = require('rxjs');

const fetch = require('node-fetch');
const { object } = require('rxfire/database');
const { initializeApp } = require('firebase');
require('firebase/database');

const appConfig = {
  apiKey: 'AIzaSyDsUS_QC_7jWkHba3t20c207ME5f82DuSE',
  authDomain: 'rockfordkeeper2023.firebaseapp.com',
  databaseURL: 'https://rockfordkeeper2023-default-rtdb.firebaseio.com',
  projectId: 'rockfordkeeper2023',
  storageBucket: 'rockfordkeeper2023.appspot.com',
  messagingSenderId: '674579017967',
  appId: '1:674579017967:web:fc0eab8ef5a42942daab1a'
};

module.exports.getRoot$ = () => {
  const app = initializeApp(appConfig);
  const root$ = object(app.database().ref());
  // every 6 minutes
  return timer(0, 300000).pipe(
    mergeMap(() => root$.pipe(take(1))),
    map(change => change.snapshot.val())
  )
};

module.exports.dropData = async () => {
  await fetch(`${appConfig.databaseURL}/owners.json`, {
    method: 'DELETE'
  });
  await fetch(`${appConfig.databaseURL}/players.json`, {
    method: 'DELETE'
  });
  await fetch(`${appConfig.databaseURL}/picks.json`, {
    method: 'DELETE'
  });
}

module.exports.writeOwners = async owners => {
  await fetch(`${appConfig.databaseURL}/owners.json`, {
    method: 'PUT',
    body: JSON.stringify(owners)
  });
};

module.exports.writePlayers = async players => {
  for (const player of players) {
    await fetch(`${appConfig.databaseURL}/players.json`, {
      method: 'POST',
      body: JSON.stringify(player)
    });
  }
};

module.exports.writePicks = async picks => {
  for (const pick of picks) {
    await fetch(`${appConfig.databaseURL}/picks/${pick.overallSelection}.json`, {
      method: 'PUT',
      body: JSON.stringify(pick)
    });
  }

  await fetch(`${appConfig.databaseURL}/currentPick.json`, {
    method: 'PUT',
    body: JSON.stringify(picks[0])
  });
};
