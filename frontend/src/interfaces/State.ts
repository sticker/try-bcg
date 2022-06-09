import { Contracts } from './Contracts';

export interface IState {
  contracts: () => Contracts;
  accounts: string[];
  defaultAccount: string | null;
  currentNetworkId: number | null;
  counter: number;
}
