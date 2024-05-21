import { Connection, PublicKey } from "@solana/web3.js";
import {
	StakeDepositReceipt,
	StakeDepositReceiptSchema,
} from "./states/index.js";

export class SplTokenStaking {
	/** Solana connection */
	connection: Connection;
	/** Program id */
	programId: PublicKey;
	/** Stake pool */
	stakePool: PublicKey;

	constructor(
		/** Solana connection */
		connection: Connection,
		/** Stake pool (default: 9AdEE8AAm1XgJrPEs4zkTPozr3o4U5iGbgvPwkNdLDJ3) */
		stakePool: PublicKey = new PublicKey("9AdEE8AAm1XgJrPEs4zkTPozr3o4U5iGbgvPwkNdLDJ3"),
		/** Program id (default: STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB) */
		programId: PublicKey = new PublicKey("STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB"),
	) {
		this.connection = connection;
		this.programId = programId;
		this.stakePool = stakePool;
	}

	/**
	 * Fetches all receipts owned by `owner`
	 *
	 * @param owner Wallet to get receipts for
	 * @returns All receipts owned by `owner`
	 */
	async getReceiptsByOwner(owner: PublicKey): Promise<
		{
			pubkey: PublicKey;
			receipt: StakeDepositReceipt;
		}[]
	> {
		return (
			await this.connection.getProgramAccounts(this.programId, {
				filters: [
					{ dataSize: 296 },
					{ memcmp: { offset: 0, bytes: owner.toBase58() } },
					{ memcmp: { offset: 64, bytes: this.stakePool.toBase58() } },
				],
			})
		).map(({ pubkey, account: { data } }) => ({
			pubkey,
			receipt: StakeDepositReceiptSchema.decode(data, 0),
		}));
	}

	/**
	 * Subscribes to receipts changes owned by `owner`
	 *
	 * @param owner Wallet to get updates of receipts for
	 * @param cb Callback which'll be called by listener
	 * @returns Subscription id
	 */
	onReceiptsUpdate(
		owner: PublicKey,
		cb: (pubkey: PublicKey, receipt: StakeDepositReceipt) => any,
	): number {
		return this.connection.onProgramAccountChange(
			this.programId,
			({ accountId, accountInfo }, _) =>
				cb(accountId, StakeDepositReceiptSchema.decode(accountInfo.data, 0)),
			undefined,
			[
				{ dataSize: 296 },
				{ memcmp: { offset: 0, bytes: owner.toBase58() } },
				{ memcmp: { offset: 64, bytes: this.stakePool.toBase58() } },
			],
		);
	}
}
