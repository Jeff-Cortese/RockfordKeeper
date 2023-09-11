import { createReducer, on } from '@ngrx/store';
import { IAppState, initialState } from './appState';
import { AppActions } from './appActions';


export const appReducer =
  createReducer(initialState, ...AppActions.map(act => on(act, reducer)));

export function rockfordKeeperReducer(state, action) {
  return appReducer(state, action);
}

export function reducer(state: IAppState = initialState, action: any): IAppState {
  // tslint:disable-next-line:no-console
  console.log('reducer', state, action);
  switch (action.type) {
    case 'GET_OWNERS_DONE': {
      return { ...state, owners: action.owners, isLoadingOwners: false };
    }

    case 'GET_PICKS_DONE': {
      return {
        ...state,
        picks: action.picks,
        currentPick: state.currentPick || action.picks[0],
        isLoadingPicks: false
      };
    }

    case 'GET_PLAYERS_DONE': {
      return { ...state, players: action.players, isLoadingPlayers: false };
    }

    case 'GET_CURRENT_PICK_DONE': {
      if (action.pick.payload.val()) {
        return { ...state, currentPick: action.pick };
      } else {
        return state;
      }
    }

    case 'SELECT_PLAYER': {
      return {
        ...state,
        isSelectingPlayer: true,
        isSelectionChanging: true
      };
    }

    case 'UNSELECT_PLAYER': {
      return {
        ...state,
        isUnselectingPlayer: true,
        isSelectionChanging: true
      };
    }

    case 'SELECTION_CHANGING_DONE': {
      return {
        ...state,
        isSelectingPlayer: false,
        isUnselectingPlayer: false,
        isSelectionChanging: false
      };
    }

    case 'MAKE_USER_ADMIN': {
      return { ...state, isAdmin: true };
    }

    case 'SHOW_EXTRA': {
      return { ...state, showExtra: true };
    }

    default: {
      return state;
    }
  }
}
