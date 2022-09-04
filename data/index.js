const getPlayerData = require('./espn-projections');
const generatePicks = require('./picks');
const { generateOwnerData, addPlayerToRoster } = require('./owners');

const firebase = require('./firebaseDataAccess');

(async () => {
  const players = await getPlayerData();
  const picks = await generatePicks();
  const owners = generateOwnerData();

  for (const pick of picks) {
    if (pick.keeperName) {
      const player = players.find(player => player.lowerName.trim() === pick.keeperName.toLowerCase().trim());
      if (player) {
        player.isTaken = true;
        pick.player = player;
        pick.playerId = player.espnPlayerId;
        owners[pick.teamId] = addPlayerToRoster(owners[pick.teamId], player)
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
