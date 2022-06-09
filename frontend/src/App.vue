<template>
  <div>
    <button class="connect" @click="connectMetamask">Connect Wallet</button>
    <div class="counter">counter: {{ counter }}</div>
    <button class="fetch" @click="fetchCounter()">fetch</button>
    <button class="plus" @click="counterPlus(1)">plus</button>
    <button class="reset" @click="counterReset()">reset</button>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {
  inject: ['web3', 'expectedNetworkId'],

  data: () => ({
    errorMessage: '',
  }),

  computed: {
    ...mapState([
      'defaultAccount',
      'currentNetworkId',
      'counter',
    ]),

  },

  methods: {
    ...mapActions([
      'initialize',
      'pollAccountsAndNetwork',
      'fetchCounter',
      'counterPlus',
      'counterReset',
    ]),

    async configureMetaMask() {
      const web3 = this.web3.currentProvider;
      if (this.expectedNetworkId === 97 && this.currentNetworkId !== 97) {
        try {
          const ret = await web3.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }],
          });
        } catch (switchError) {
          try {
            await web3.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x61',
                  chainName: 'Binance Smart Chain Testnet',
                  nativeCurrency: {
                    name: 'Binance Coin',
                    symbol: 'BNB',
                    decimals: 18,
                  },
                  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                  blockExplorerUrls: ['https://testnet.bscscan.com'],
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
            this.errorMessage = addError.message;
          }
        }
      } else if (this.expectedNetworkId === 56 && this.currentNetworkId !== 56) {
        {
          try {
            const ret = await web3.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x38' }],
            });
          } catch (switchError) {
            try {
              await web3.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x38',
                    chainName: 'Binance Smart Chain Mainnet',
                    nativeCurrency: {
                      name: 'Binance Coin',
                      symbol: 'BNB',
                      decimals: 18,
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/'],
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
              this.errorMessage = addError.message;
            }
          }
        }
      }
    },

    async connectMetamask() {
      const web3 = this.web3.currentProvider;
      this.configureMetaMask();
      this.errorMessage = 'Connecting to MetaMask...';
      web3
        .request({ method: 'eth_requestAccounts' })
        .then(async () => {
          this.errorMessage = 'Success: MetaMask connected.';
          this.doPollAccounts = true;
          const pollAccounts = async () => {
            if (!this.doPollAccounts) return;
            try {
              await this.pollAccountsAndNetwork();
            } catch (e) {
              console.error(e);
            }
            setTimeout(pollAccounts, 200);
          };
          pollAccounts();
        })
        .catch(() => {
          this.errorMessage = 'Error: MetaMask could not get permissions.';
        });
    },

  },

  async created() {
    try {
      await this.initialize();
    } catch (e) {
      console.error(e);
      this.errorMessage = e.message;
    }
    await this.configureMetaMask();
  },
};
</script>

<style>
</style>

<style scoped>
</style>
