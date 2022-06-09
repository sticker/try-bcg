import { abi as firstAbi, networks as firstNetworks } from '../../build/contracts/First.json';

import Web3 from 'web3';
import { Contracts } from './interfaces';

const networkId = process.env.VUE_APP_NETWORK_ID || '5777';

type Networks = Partial<Record<string, { address: string }>>;

type Abi = any[];

export async function setUpContracts(web3: Web3): Promise<Contracts> {
  const firstAddr = process.env.VUE_APP_FIRST_CONTRACT_ADDRESS || (firstNetworks as Networks)[networkId]!.address;
  const First = new web3.eth.Contract(firstAbi as Abi, firstAddr);
  return { First };
}
