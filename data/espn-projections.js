const fetch = require('node-fetch');
//const proTeams = require('./pro-teams');

const thisYear = 2021;
const lastYear = thisYear - 1;

const playerDataUrl = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${thisYear}/segments/0/leaguedefaults/3?scoringPeriodId=0&view=kona_player_info`;
const seasonsUrl = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${thisYear}?view=proTeamSchedules_wl`

async function getProTeams() {
  const resp = await fetch(seasonsUrl);
  const { settings } = await resp.json();
  return settings.proTeams;
}

async function getPlayerData(start, count) {
  const filterParams = {
    players: {
      filterSlotIds: {value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24]},
      filterStatsForSplitTypeIds: {value: [0]},
      filterStatsForSourceIds: {value: [1]},
      filterStatsForExternalIds: {value: [thisYear]},
      sortDraftRanks: {sortPriority: 2, sortAsc: true, value: 'STANDARD'},
      sortPercOwned: {sortPriority: 3, sortAsc: false},
      limit: count,
      offset: start,
      filterStatsForTopScoringPeriodIds: {value: 2, additionalValue: [`00${thisYear}`,`10${thisYear}`,`00${lastYear}`,`02${thisYear}`]}
    }
  };
  const response = await fetch(playerDataUrl, {
    headers: {
      'x-fantasy-filter': JSON.stringify(filterParams)
    }
  });

  return await response.json();
}

const positionById = {
  1: 'QB',
  2: 'RB',
  3: 'WR',
  4: 'TE',
  5: 'K',
  16: 'D/ST'
};

module.exports = async () => {
  const { players } = await getPlayerData(0, 400);
  const proTeams = await getProTeams();

  const rkPlayers = players.map(({ player }) => ({
    bye: proTeams.find(team => team.id === player.proTeamId)?.byeWeek ?? 20,
    espnPlayerId: player.id,
    espnRank: player.draftRanksByRankType.STANDARD.rank,
    isTaken: false,
    lowerName: player.fullName.toLowerCase(),
    name: player.fullName,
    firstName: player.firstName,
    lastName: player.lastName,
    position: positionById[player.defaultPositionId],
    projectedAverage: player.stats[0] && Math.floor(player.stats[0].appliedAverage || 0),
    projection: player.stats[0] && Math.floor(player.stats[0].appliedTotal || 0),
    team: proTeams.find(team => team.id === player.proTeamId)?.abbrev ?? 'FA',
    isInjured: player.injured,
    injuryStatus: player.injuryStatus
  }));

  rkPlayers.sort((a, b) => a.espnRank - b.espnRank);

  return rkPlayers;
};
