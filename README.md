Spl Token Staking Wrapper
=========================

This TS Library is built around the Bonkrewards staking contract. This library allows you to fetch information about a user's stake directly from the contract. 

Creating an instance
=================

Before using the lib you need to create an instance `SplTokenStaking` as shown in the example below.

```ts
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
```

Once an instance is created we can now fetch info from our desired PubKey below.
=================

```ts
import { PublicKey } from "@solana/web3.js";

// For the sake of this demo, we have imported a random PubKey. You would inject your desired target in this field instead.
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
```

Below is an example of how you can receive updates about the user's stake using a listener.
==============================

```ts
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

// ...Once you're done listening for updates, you can use this code below to unsubscribe.
await connection.removeProgramAccountChangeListener(subscriptionId);
```
