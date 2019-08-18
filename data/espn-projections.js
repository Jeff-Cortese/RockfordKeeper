const fetch = require('node-fetch');
const proTeams = require('./pro-teams');

const playerDataUrl2019 = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leaguedefaults/1?scoringPeriodId=0&view=kona_player_info';

async function getPlayerData(start, count) {
  const filterParams = {
    players: {
      filterSlotIds: {value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24]},
      filterStatsForSplitTypeIds: {value: [0]},
      filterStatsForSourceIds: {value: [1]},
      filterStatsForExternalIds: {value: [2019]},
      sortDraftRanks: {sortPriority: 2, sortAsc: true, value: 'STANDARD'},
      sortPercOwned: {sortPriority: 3, sortAsc: false},
      limit: count,
      offset: start,
      filterStatsForTopScoringPeriodIds: {value: 2, additionalValue: ['002019', '102019', '002018']}
    }
  };
  const response = await fetch(playerDataUrl2019, {
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

function getProTeamById(id) {
  return proTeams.find(team => team.id === id);
}


module.exports = async () => {
  const { players } = await getPlayerData(0, 400);

  const rkPlayers = players.map(({ player }) => ({
    bye: getProTeamById(player.proTeamId).byeWeek,
    espnPlayerId: player.id,
    espnRank: player.draftRanksByRankType.STANDARD.rank,
    isTaken: false,
    lowerName: player.fullName.toLowerCase(),
    name: player.fullName,
    firstName: player.firstName,
    lastName: player.lastName,
    position: positionById[player.defaultPositionId],
    projectedAverage: player.stats[0] && player.stats[0].appliedAverage,
    projection: player.stats[0] && player.stats[0].appliedTotal,
    team: getProTeamById(player.proTeamId).abbrev,
    isInjured: player.injured,
    injuryStatus: player.injuryStatus
  }));

  rkPlayers.sort((a, b) => a.espnRank - b.espnRank);

  return rkPlayers;
};