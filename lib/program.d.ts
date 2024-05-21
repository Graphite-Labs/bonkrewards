import { Connection, PublicKey } from "@solana/web3.js";
import { StakeDepositReceipt } from "./states/index.js";
export declare class SplTokenStaking {
    connection: Connection;
    programId: PublicKey;
    stakePool: PublicKey;
    constructor(connection: Connection, stakePool?: PublicKey, programId?: PublicKey);
    getReceiptsByOwner(owner: PublicKey): Promise<{
        pubkey: PublicKey;
        receipt: StakeDepositReceipt;
    }[]>;
    onReceiptsUpdate(owner: PublicKey, cb: (pubkey: PublicKey, receipt: StakeDepositReceipt) => any): number;
}
