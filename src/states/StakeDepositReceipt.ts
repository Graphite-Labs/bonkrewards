import { PublicKey } from "@solana/web3.js";
import * as lo from "../buffer-layout.js";

export type StakeDepositReceipt = {
	/** Pubkey that owns the staked assets */
	owner: PublicKey;
	/** Pubkey that paid for the deposit */
	payer: PublicKey;
	/** StakePool the deposit is for */
	stakePool: PublicKey;
	/** Duration of the lockup period in seconds */
	lockupDuration: bigint;
	/** Timestamp in seconds of when the stake lockup began */
	depositTimestamp: bigint;
	/** Amount of SPL token deposited */
	depositAmount: bigint;
	/** Amount of stake weighted by lockup duration. */
	effectiveStake: bigint;
	/**
	 * The amount per reward that has been claimed or perceived to be claimed. Indexes align with
	 * the StakedPool rewardPools property.
	 */
	claimedAmounts: bigint[];
};

export const StakeDepositReceiptSchema = lo.struct<StakeDepositReceipt>([
	lo.publicKey("owner"),
	lo.publicKey("payer"),
	lo.publicKey("stakePool"),
	lo.u64("lockupDuration"),
	lo.s64("depositTimestamp"),
	lo.u64("depositAmount"),
	lo.u128("effectiveStake"),
	lo.seq(lo.u128(), 10, "claimedAmounts"),
]);
