import * as lo from "../buffer-layout.js";
export const StakeDepositReceiptSchema = lo.struct([
    lo.publicKey("owner"),
    lo.publicKey("payer"),
    lo.publicKey("stakePool"),
    lo.u64("lockupDuration"),
    lo.s64("depositTimestamp"),
    lo.u64("depositAmount"),
    lo.u128("effectiveStake"),
    lo.seq(lo.u128(), 10, "claimedAmounts"),
]);
