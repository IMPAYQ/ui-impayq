// utils/aztecTokenUtils.ts

import { TokenContract } from "@aztec/noir-contracts.js/Token"
import { AztecAddress, Wallet } from "@aztec/aztec.js"

/**
 * Mints new tokens privately from a merchant minter to a specified recipient.
 */
export async function mintTokensToPrivate(
  token: TokenContract,
  minterWallet: Wallet,
  recipient: AztecAddress,
  amount: bigint
) {
  console.log(`🔐 Minting ${amount} tokens to ${recipient.toString()}...`)
  // Re-bind the contract to the minter's wallet, just to be safe
  const tokenAsMinter = await TokenContract.at(token.address, minterWallet)
  const from = minterWallet.getAddress()
  
  await tokenAsMinter.methods
    .mint_to_private(from, recipient, amount)
    .send()
    .wait()
  
  console.log(`✅ Successfully minted ${amount} tokens to ${recipient.toString()}`)
}
