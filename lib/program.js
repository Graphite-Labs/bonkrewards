import { PublicKey } from "@solana/web3.js";
import { StakeDepositReceiptSchema, } from "./states/index.js";
export class SplTokenStaking {
    connection;
    programId;
    stakePool;
    constructor(connection, stakePool = new PublicKey("9AdEE8AAm1XgJrPEs4zkTPozr3o4U5iGbgvPwkNdLDJ3"), programId = new PublicKey("STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB")) {
        this.connection = connection;
        this.programId = programId;
        this.stakePool = stakePool;
    }
    async getReceiptsByOwner(owner) {
        return (await this.connection.getProgramAccounts(this.programId, {
            filters: [
                { dataSize: 296 },
                { memcmp: { offset: 0, bytes: owner.toBase58() } },
                { memcmp: { offset: 64, bytes: this.stakePool.toBase58() } },
            ],
        })).map(({ pubkey, account: { data } }) => ({
            pubkey,
            receipt: StakeDepositReceiptSchema.decode(data, 0),
        }));
    }
    onReceiptsUpdate(owner, cb) {
        return this.connection.onProgramAccountChange(this.programId, ({ accountId, accountInfo }, _) => cb(accountId, StakeDepositReceiptSchema.decode(accountInfo.data, 0)), undefined, [
            { dataSize: 296 },
            { memcmp: { offset: 0, bytes: owner.toBase58() } },
            { memcmp: { offset: 64, bytes: this.stakePool.toBase58() } },
        ]);
    }
}
