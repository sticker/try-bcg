import Vuex from 'vuex';
import Web3 from 'web3';
import _ from 'lodash';

import { setUpContracts } from './contracts';
import { IState } from './interfaces';

export function createStore(web3: Web3) {
  return new Vuex.Store<IState>({
    state: {
      contracts: null!,
      accounts: [],
      defaultAccount: null,
      currentNetworkId: null,
      counter: 0,
    },

    getters: {
      contracts(state: IState) {
        return _.isFunction(state.contracts) ? state.contracts() : null!;
      },

    },

    mutations: {
      setNetworkId(state, payload) {
        state.currentNetworkId = payload;
      },

      setAccounts(state: IState, payload) {
        state.accounts = payload.accounts;

        if (payload.accounts.length > 0) {
          state.defaultAccount = payload.accounts[0];
        }
        else {
          state.defaultAccount = null;
        }
      },

      setContracts(state: IState, payload) {
        state.contracts = payload;
      },

      updateCounter(state: IState, counter) {
        state.counter = counter;
      },

    },

    actions: {
      async initialize({ dispatch }) {
        await dispatch('setUpContracts');
        await dispatch('pollNetwork');
      },

      async setUpContracts({ commit }) {
        const contracts = await setUpContracts(web3);
        commit('setContracts', () => contracts);
      },

      async pollNetwork({ state, commit }) {
        const networkId = await web3.eth.net.getId();

        if(state.currentNetworkId !== networkId) {
          commit('setNetworkId', networkId);
        }
      },

      async pollAccountsAndNetwork({ state, commit }) {
        const networkId = await web3.eth.net.getId();

        if(state.currentNetworkId !== networkId) {
          commit('setNetworkId', networkId);
        }

        const accounts = await web3.eth.requestAccounts();

        if (!_.isEqual(state.accounts, accounts)) {
          commit('setAccounts', { accounts });
        }

      },

      async fetchCounter({ state, commit }) {
        const counter = await state.contracts().First!.methods
          .counter()
          .call({from: state.defaultAccount});
        console.log({counter});

        if (state.counter !== Number(counter)) {
          commit('updateCounter', Number(counter));
        }
      },

      async counterPlus({ state }, num) {
        if(!state.defaultAccount) return;

        await state.contracts().First!.methods.plus(num)
          .send({from: state.defaultAccount});
      },

      async counterReset({ state }) {
        if(!state.defaultAccount) return;

        await state.contracts().First!.methods.reset()
          .send({from: state.defaultAccount});
      },
    }
  });
}
