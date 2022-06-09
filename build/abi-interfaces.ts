import { Web3JsAbiCall } from '../abi-common';

export interface First {
  counter(): Web3JsAbiCall<string>;
  plus(num: string | number): Web3JsAbiCall<void>;
  reset(): Web3JsAbiCall<void>;
}
