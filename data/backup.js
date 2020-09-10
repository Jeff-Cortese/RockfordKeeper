const { writeFileSync } = require('fs');
const { getRoot$ } = require('./firebaseDataAccess');
(async () => {
  getRoot$()
    .subscribe(
      (dbVal) => {
        const fileName = `2020_${new Date().getTime()}.json`;
        console.log(`Backing up db to ${fileName}. Overall Selection: ${dbVal.currentPick && dbVal.currentPick.overallSelection}`);
        writeFileSync(`${__dirname}/backups/${fileName}`, JSON.stringify(dbVal, null, 2));
      },
      error => {
        console.error(error)
        process.exit(1);
      },
      () => console.log('Backup stream completed')
    );
})();
