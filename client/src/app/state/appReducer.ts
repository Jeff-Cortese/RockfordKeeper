import { IAppState, initialState } from './appState';
import { AppAction } from './appActions';

export function appReducer(state: IAppState = initialState, action: AppAction) {
  switch (action.type) {
    case 'GET_OWNERS_DONE': {
      return { ...state, owners: action.owners };
    }

    case 'GET_PICKS_DONE': {
      return { ...state, picks: action.picks };
    }

    case 'GET_PLAYERS_DONE': {
      return { ...state, players: action.players };
    }

    default: {
      return state;
    }
  }
}
