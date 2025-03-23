// import { AccountWalletWithSecretKey, AztecAddress, AztecAddressLike, createPXEClient } from '@aztec/aztec.js';
// import { TokenContract } from '@aztec/noir-contracts.js/Token';
// import { useState } from 'react';

// interface BalanceFilters {
//   walletAddress: string;
//   networks: number[];
// }

// export const useTransferToken = () => {
//   const PXE_URL = process.env.PXE_URL || 'http://35.228.247.23:8080';
//   const pxe = createPXEClient(PXE_URL);
//   const [tokenAddress, setTokenAddress] = useState("0x2d55c209e94816dfe3bbfd6e0f5515738ddc96520dcb1ae1c8a34d6a22a950f4");
  

//   async function mintTokensToPrivate(minterWallet: AccountWalletWithSecretKey, recipient: AztecAddressLike, amount: bigint) {
//     const tokenAsMinter = await TokenContract.at(AztecAddress.fromString(tokenAddress), minterWallet);
//     const from = minterWallet.getAddress(); // we are setting from to minter here because we need a sender to calculate the tag
//     await tokenAsMinter.methods
//       .mint_to_private(from, recipient, amount)
//       .send()
//       .wait();
//   }


//   return {
//     mintTokensToPrivate
//   };
// };