const owners = require('./owners.json');

module.exports.addPlayerToRoster = function(addToOwner, playerToAdd) {
  const roster = addToOwner.roster || {};
  const addToBench = player => roster.bench = [...(addToOwner.roster.bench || []), player];

  switch (playerToAdd.position) {
    case 'QB': {
      if (!roster.qb) {
        roster.qb = playerToAdd;
      } else {
        addToBench(playerToAdd);
      }
      break;
    }
    case 'RB': {
      if (!roster.rb1) {
        roster.rb1 = playerToAdd;
      } else if (!roster.rb2) {
        roster.rb2 = playerToAdd;
      } else if (!roster.flx) {
        roster.flx = playerToAdd;
      } else {
        addToBench(playerToAdd);
      }
      break;
    }
    case 'WR': {
      if (!roster.wr1) {
        roster.wr1 = playerToAdd;
      } else if (!roster.wr2) {
        roster.wr2 = playerToAdd;
      } else if (!roster.flx) {
        roster.flx = playerToAdd;
      } else {
        addToBench(playerToAdd);
      }
      break;
    }
    case 'TE': {
      if (!roster.te) {
        roster.te = playerToAdd;
      } else if (!roster.flx) {
        roster.flx = playerToAdd;
      } else {
        addToBench(playerToAdd);
      }
      break;
    }
    case 'D/ST': {
      if (!roster.dst) {
        roster.dst = playerToAdd;
      } else {
        addToBench(playerToAdd);
      }
      break;
    }
    case 'K': {
      if (!roster.k) {
        roster.k = playerToAdd;
      } else {
        addToBench(playerToAdd);
      }
      break;
    }
    default: {
      addToBench(playerToAdd);
      break;
    }
  }

  return {
    ...addToOwner,
    roster
  };
}

module.exports.generateOwnerData = function() {
  return Object.keys(owners).reduce((accum, owner) => ({
    ...accum,
    [owner]: {
      ...owners[owner],
      roster: {
        qb: '',
        rb1: '',
        rb2: '',
        wr1: '',
        wr2: '',
        te: '',
        flx: '',
        dst: '',
        k: '',
        bench: []
      }
    }
  }), owners);
};