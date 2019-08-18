const fs = require('fs');
const teamNicknames = require('./nickNames.json');

module.exports = async () => {
  const rawPicks = fs.readFileSync('picks.csv', { encoding: 'ascii'}).split('\n');
  return rawPicks
    .filter(rawPick => rawPick.indexOf('ROUND') < 0 && rawPick.indexOf('Pick') < 0)
    .map(rawPick => {
      const [roundPick, overallPick, owner, keeper, byWayOf] = rawPick.split(',');
      return {
        roundSelection: parseInt(roundPick),
        overallSelection: parseInt(overallPick),
        round: Math.floor((parseInt(overallPick) - 1) / 12) + 1,
        isKeeper: Boolean(keeper),
        keeperName: keeper,
        teamId: teamNicknames[owner],
        byWayOf: byWayOf.replace('\r', '')
      };
    });
};