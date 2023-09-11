const fetch = require('node-fetch');
const _ = require('lodash');
const fs = require('fs')
//const proTeams = require('./pro-teams');

const thisYear = 2023;
const lastYear = thisYear - 1;

const playerDataUrl = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${thisYear}/segments/0/leaguedefaults/3?scoringPeriodId=0&view=kona_player_info`;
const seasonsUrl = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${thisYear}?view=proTeamSchedules_wl`;
const depthChartMemo = _.memoize(async (teamId) => await getTeamDepthChart(teamId));
const rookies = fs.readFileSync('rookies.txt');

async function getProTeams() {
  const resp = await fetch(seasonsUrl);
  const { settings } = await resp.json();
  return settings.proTeams;
}

async function getTeamDepthChart(teamId) {
  if (!teamId) {
    return;
  }
  const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${thisYear}/teams/${teamId}/depthcharts`;

  const resp = await fetch(url);
  const teamDepthChart = await resp.json();

  const offense = _.values(teamDepthChart.items.find(tdc => tdc.name === '3WR 1TE')?.positions);
  const athletes = _.flatMap(offense, p => p.athletes);
  return athletes;
}

async function getPlayerDepth(player) {
  const playerId = player.espnPlayerId;
  const teamId = player.proTeamId;

  const teamDepthAthletes = await depthChartMemo(teamId);
  const depth = teamDepthAthletes?.find(ath => ath.athlete.$ref.includes(`/${playerId}`));
  return depth?.rank;
}

async function getPlayerData(start, count) {
  const filterParams = {
    players: {
      filterSlotIds: { value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24] },
      filterStatsForSplitTypeIds: { value: [0] },
      filterStatsForSourceIds: { value: [1] },
      filterStatsForExternalIds: { value: [thisYear] },
      sortDraftRanks: { sortPriority: 2, sortAsc: true, value: 'STANDARD' },
      sortPercOwned: { sortPriority: 3, sortAsc: false },
      limit: count,
      offset: start,
      filterStatsForTopScoringPeriodIds: {
        value: 2,
        additionalValue: [`00${thisYear}`, `10${thisYear}`, `00${lastYear}`, `02${thisYear}`]
      }
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
    espnRank: player.draftRanksByRankType?.STANDARD.rank,
    isTaken: false,
    lowerName: player.fullName.toLowerCase(),
    name: player.fullName,
    firstName: player.firstName,
    lastName: player.lastName,
    position: positionById[player.defaultPositionId],
    projectedAverage: player.stats[0] && Math.floor(player.stats[0].appliedAverage || 0),
    projection: player.stats[0] && Math.floor(player.stats[0].appliedTotal || 0),
    team: proTeams.find(team => team.id === player.proTeamId)?.abbrev ?? 'FA',
    proTeamId: player.proTeamId,
    isInjured: player.injured,
    injuryStatus: player.injuryStatus,
    isRookie: rookies.includes(player.fullName),
    adp: parseFloat((Math.round((player.ownership.averageDraftPosition + Number.EPSILON) * 10) / 10).toFixed(1)),
    adpChange: parseFloat((Math.round((player.ownership.averageDraftPositionPercentChange + Number.EPSILON) * 10) / 10).toFixed(1))
  }));

  for (const player of rkPlayers) {
    player.positionDepth = await getPlayerDepth(player);
  }

  rkPlayers.sort((a, b) => a.espnRank - b.espnRank);

  return rkPlayers;
};
