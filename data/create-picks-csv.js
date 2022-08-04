const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');
const _ = require('lodash');
const nickNames = require('./nickNames.json');

async function ask(question) {
  const lineIn = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return await new Promise(resolve => {
    lineIn.question(`${question} `, answer => {
      lineIn.close();
      resolve(answer);
    });
  });
}


(async () => {
  const filename = await ask('./backups file name:');
  const filePath = path.join(__dirname, 'backups', filename);
  if (!fs.existsSync(filePath)) {
    throw new Error('FILE_DOES_NOT_EXIST');
  }

  const { picks } = require(filePath);

  const nameByNickname = _.invert(nickNames);
  const picksByRound = _.groupBy(picks.filter(Boolean), 'round');
  const output = `Pick,No.,Owner,Player,Notes\n` +
    Object.entries(picksByRound).map(([round, roundPicks]) =>
      `ROUND ${round},,,\n` + roundPicks.map(pick => `${pick.roundSelection},${pick.overallSelection},${nameByNickname[pick.teamId] ?? pick.teamId},${pick.player?.name ?? ''},${pick.byWayOf ?? ''}`).join('\n')
    ).join('\n');

  fs.writeFileSync(path.join(__dirname, 'backups', filename.replace('.json', '.csv')), output);
})()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
