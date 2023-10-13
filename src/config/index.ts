import { Alchemy, Network } from 'alchemy-sdk';

export const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


export const alchemy = new Alchemy(settings);
