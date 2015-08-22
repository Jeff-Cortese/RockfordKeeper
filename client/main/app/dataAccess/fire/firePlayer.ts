import FireTraits from './fireTraits';

export default class FirePlayer extends FireTraits implements IPlayerDataAccess{
  setIsTaken = (playerId:string, isTaken: boolean) =>
    super.updateObservable(playerId, 'isTaken', isTaken);
}
