Spl Token Staking Wrapper
=========================

Wrapper around `spl-token-staking` contract for proper listening to receipts updates and/or fetching it

Creating instance
=================

Before using lib you should create instance of `SplTokenStaking`

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

Fetching receipts
=================

```ts
import { PublicKey } from "@solana/web3.js";

// that's just an example wallet
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

Listening for receipts updates
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

// ... after some time, if you need, you can unsubscribe from it
await connection.removeProgramAccountChangeListener(subscriptionId);
```
