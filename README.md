# bonkrewards
BonkRewards contract wrapper.
A TS library built around the spl-token-staking contract that BonkRewards uses, this library allows you to fetch information such as bonk stake, duration of bonk staked, and multiplier.

Step 1: Creating an instance
Before using lib you should create an instance of SplTokenStaking as shown below:

import { Connection } from "@solana/web3.js";
import { SplTokenStaking } from "@solport/spl-token-staking-wrapper";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const wrapper = new SplTokenStaking(
    // Connection to solana network
    connection,
    // optional: Stake pool (default one is Official Bonk, 9AdEE8AAm1XgJrPEs4zkTPozr3o4U5iGbgvPwkNdLDJ3)
    undefined,
    // optional: Program id (usually you'll use default one, STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB)
    undefined,
);
Fetching receipts
import { PublicKey } from "@solana/web3.js";

// This is just an example wallet shown below, you would inject the desired publickey in production.
const owner: PublicKey = new PublicKey("64qJxJocstmHMezdxViYU9amJFYvw79Vy3wRR4kfkxAK");
const receipts = await wrapper.getReceiptsByOwner(owner);
console.log(receipts);
/// Example output:
/// [
///     {
///         pubkey: PublicKey [PublicKey(...)]
///         receipt: {
///             owner: PublicKey [PublicKey(64qJxJocstmHMezdxViYU9amJFYvw79Vy3wRR4kfkxAK)],
///             payer: PublicKey [PublicKey(64qJxJocstmHMezdxViYU9amJFYvw79Vy3wRR4kfkxAK)], // usually same as owner
///             stakePool: PublicKey [PublicKey(9AdEE8AAm1XgJrPEs4zkTPozr3o4U5iGbgvPwkNdLDJ3)],
///             lockupDuration: 2592000n,
///             depositTimestamp: 1717008300000n,
///             depositAmount: 13500000000000n,
///             effectiveStake: 13500000000000n,
///             claimedAmounts: [
///                 0n,
///                 0n,
///                 0n,
///                 0n,
///                 0n,
///                 0n,
///                 0n,
///                 0n,
///                 0n,
///                 0n
///             ]
///         }
///     }
/// ]
Now we can listen for updates from the contract for our desired public key.
import { PublicKey } from "@solana/web3.js";

// that's just an example wallet
const owner: PublicKey = new PublicKey("64qJxJocstmHMezdxViYU9amJFYvw79Vy3wRR4kfkxAK");
const subscriptionId = wrapper.onReceiptsUpdate(
    owner,
    (pubkey, receipt) => console.log({ pubkey, receipt }),
);
/// Example output (after staking):
/// {
///     pubkey: PublicKey [PublicKey(...)]
///     receipt: {
///         owner: PublicKey [PublicKey(64qJxJocstmHMezdxViYU9amJFYvw79Vy3wRR4kfkxAK)],
///         payer: PublicKey [PublicKey(64qJxJocstmHMezdxViYU9amJFYvw79Vy3wRR4kfkxAK)],
///         stakePool: PublicKey [PublicKey(9AdEE8AAm1XgJrPEs4zkTPozr3o4U5iGbgvPwkNdLDJ3)],
///         lockupDuration: 2592000n,
///         depositTimestamp: 1717008300000n,
///         depositAmount: 13500000000000n,
///         effectiveStake: 13500000000000n,
///         claimedAmounts: [
///             0n,
///             0n,
///             0n,
///             0n,
///             0n,
///             0n,
///             0n,
///             0n,
///             0n,
///             0n
///         ]
///     }
/// }

// ... Once you have the desired info you required from the pubkey above you can unsubcribe from it using the code blow.
await connection.removeProgramAccountChangeListener(subscriptionId);
