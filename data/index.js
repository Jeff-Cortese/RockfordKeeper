const getPlayerData = require('./espn-projections');
const generatePicks = require('./picks');
const generateOwners = require('./owners');
const firebase = require('./firebaseDataAccess');

(async () => {
  const players = await getPlayerData();
  const picks = await generatePicks();
  const owners = generateOwners();

  for (const pick of picks) {
    if (pick.keeperName) {
      const player = players.find(player => player.lowerName.trim() === pick.keeperName.toLowerCase().trim());
      if (player) {
        player.isTaken = true;
        pick.player = player;
        pick.playerId = player.espnPlayerId;
      } else {
        console.error(`Could not find matching player for keeper ${pick.keeperName}`)
      }
    }
  }

  await firebase.writeOwners(owners);
  await firebase.writePlayers(players);
  await firebase.writePicks(picks);
  process.exit(0);
})();