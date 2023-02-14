//#region process & fetches
type ProcessStateKey = 'wait' | 'success' | 'error';
const ProcessState = {
  Wait: 'wait',
  Success: 'success',
  Error: 'error',
};

interface Process {
  [key: string]: ProcessStateKey;
}

type FetchesStateKey = 'wait' | 'success' | 'error';
const FetchesState = {
  Wait: 'wait',
  Success: 'success',
  Error: 'error',
};

interface Fetches {
  [key: string]: FetchesStateKey;
}
//#endregion

export { ProcessState, FetchesState };
export type { ProcessStateKey, Process, FetchesStateKey, Fetches };
