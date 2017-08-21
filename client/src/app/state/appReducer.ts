import { IAppState, initialState } from './appState';
import { AppAction } from './appActions';

export const reducerMap = { app: appReducer };

export function appReducer(state: IAppState = initialState, action: AppAction): IAppState {
  switch (action.type) {
    case 'GET_OWNERS_DONE': {
      return { ...state, owners: action.owners };
    }

    case 'GET_PICKS_DONE': {
      return {
        ...state,
        picks: action.picks,
        currentPick: state.currentPick || action.picks[0]
      };
    }

    case 'GET_PLAYERS_DONE': {
      return { ...state, players: action.players };
    }

    case 'GET_CURRENT_PICK_DONE': {
      if (action.pick.$exists()) {
        return { ...state, currentPick: action.pick };
      } else {
        return state;
      }
    }

    default: {
      return state;
    }
  }
}
