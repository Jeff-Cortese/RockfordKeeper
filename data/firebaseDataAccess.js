const fetch = require('node-fetch');

const baseUrl = 'https://rockfordkeeper2019.firebaseio.com';

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