const owners = require('./owners.json');

module.exports = function generateOwnerData() {
  return Object.keys(owners).reduce((accum, owner) => ({
    ...accum,
    [owner]: {
      ...owners[owner],
      roster: {
        qb: "",
        rb1: "",
        rb2: "",
        wr1: "",
        wr2: "",
        te: "",
        flx: "",
        dst: "",
        k: "",
        bench: []
      }
    }
  }), owners);
};