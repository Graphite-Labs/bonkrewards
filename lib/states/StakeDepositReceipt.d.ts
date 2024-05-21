import { PublicKey } from "@solana/web3.js";
export type StakeDepositReceipt = {
    owner: PublicKey;
    payer: PublicKey;
    stakePool: PublicKey;
    lockupDuration: bigint;
    depositTimestamp: bigint;
    depositAmount: bigint;
    effectiveStake: bigint;
    claimedAmounts: bigint[];
};
export declare const StakeDepositReceiptSchema: import("@solana/buffer-layout").Structure<StakeDepositReceipt>;
