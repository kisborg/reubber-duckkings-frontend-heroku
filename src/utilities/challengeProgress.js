import { store } from '../redux/store';

export default function defineChallengeProgress() {
  const state = store.getState();
  const { startDate, endDate } = state.challenge;

  let challengeStartTimestamp = new Date(startDate).getTime();
  let challengeEndTimestamp = new Date(endDate).getTime();
  let currentTimestamp = Date.now();

  if (currentTimestamp < challengeStartTimestamp ) {
    return "startSoon";
  }
  if (currentTimestamp < challengeEndTimestamp ) {
    return "started";
  }
  if (currentTimestamp > challengeEndTimestamp ) {
    return "ended";
  }
  
}