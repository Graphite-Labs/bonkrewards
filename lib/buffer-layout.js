import { Layout, blob, offset, s8, u8, s16, u16, s32, u32, seq, struct, union, } from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";
export class InvalidSpanError extends Error {
    constructor() {
        super("Span should be more than 0");
    }
}
class WithSkip extends Layout {
    skip;
    inner;
    constructor(skip, inner, property) {
        if (inner.span >= 0)
            super(skip + inner.span, property ?? inner.property);
        else
            super(-1, property ?? inner.property);
        this.skip = skip;
        this.inner = inner;
    }
    getSpan(b, offset = 0) {
        if (this.span >= 0)
            return this.span;
        return this.skip + this.inner.getSpan(b, offset + this.skip);
    }
    decode(b, offset = 0) {
        return this.inner.decode(b, offset + this.skip);
    }
    encode(src, b, offset = 0) {
        return this.skip + this.inner.encode(src, b, offset + this.skip);
    }
}
class WithConverter extends Layout {
    inner;
    from;
    to;
    constructor(inner, from, to, property) {
        super(inner.span, property);
        this.inner = inner;
        this.from = from;
        this.to = to;
    }
    getSpan(b, offset = 0) {
        return this.inner.getSpan(b, offset);
    }
    decode(b, offset = 0) {
        return this.from(this.inner.decode(b, offset));
    }
    encode(src, b, offset = 0) {
        return this.inner.encode(this.to(src), b, offset);
    }
}
class Boolean extends Layout {
    static defaultDiscriminator = u8();
    discriminator;
    constructor(property, discriminator) {
        let real = discriminator ?? Boolean.defaultDiscriminator;
        if (real.span < 1)
            throw new InvalidSpanError();
        super(real.span, property);
        this.discriminator = real;
    }
    decode(b, offset = 0) {
        return this.discriminator.decode(b, offset) !== 0;
    }
    encode(src, b, offset = 0) {
        return this.discriminator.encode(Number(src), b, offset);
    }
}
class Int64 extends Layout {
    constructor(property) {
        super(8, property);
    }
    decode(b, offset = 0) {
        return new DataView(b.buffer, b.byteOffset).getBigInt64(offset, true);
    }
    encode(src, b, offset = 0) {
        new DataView(b.buffer, b.byteOffset).setBigInt64(offset, src, true);
        return this.span;
    }
}
class UInt64 extends Layout {
    constructor(property) {
        super(8, property);
    }
    decode(b, offset = 0) {
        return new DataView(b.buffer, b.byteOffset).getBigUint64(offset, true);
    }
    encode(src, b, offset = 0) {
        new DataView(b.buffer, b.byteOffset).setBigUint64(offset, src, true);
        return this.span;
    }
}
class UInt128 extends Layout {
    constructor(property) {
        super(16, property);
    }
    decode(b, offset = 0) {
        const dv = new DataView(b.buffer, b.byteOffset);
        const x = dv.getBigUint64(offset, true);
        const y = dv.getBigUint64(offset + 8, true);
        return (y << 64n) + x;
    }
    encode(src, b, offset = 0) {
        const dv = new DataView(b.buffer, b.byteOffset);
        dv.setBigUint64(offset, (src >> 64n) & (1n << (64n - 1n)), true);
        dv.setBigUint64(offset, src & (1n << (64n - 1n)), true);
        return this.span;
    }
}
class Option extends Layout {
    static defaultDiscriminator = u8();
    discriminator;
    inner;
    constructor(inner, property, discriminator) {
        super(-1, property);
        this.discriminator = discriminator ?? Option.defaultDiscriminator;
        if (this.discriminator.span < 1)
            throw new InvalidSpanError();
        this.inner = inner;
    }
    getSpan(b, offset = 0) {
        let span = this.discriminator.span;
        if (this.discriminator.decode(b, offset) !== 0)
            span += this.inner.getSpan(b, offset + this.discriminator.span);
        return span;
    }
    decode(b, offset = 0) {
        if (this.discriminator.decode(b, offset) !== 0)
            return this.inner.decode(b, offset + this.discriminator.span);
        else
            return null;
    }
    encode(src, b, offset = 0) {
        if (src !== null)
            return (this.discriminator.encode(1, b, offset) +
                this.inner.encode(src, b, offset + this.discriminator.span));
        else
            return this.discriminator.encode(0, b, offset);
    }
}
class PublicKeyLayout extends Layout {
    constructor(property) {
        super(32, property);
    }
    decode(b, offset = 0) {
        return new PublicKey(b.subarray(offset, offset + this.span));
    }
    encode(src, b, offset = 0) {
        b.set(src.toBytes(), offset);
        return this.span;
    }
}
const withskip = (skip, inner, property) => new WithSkip(skip, inner, property);
const withconverter = (inner, from, to, property) => new WithConverter(inner, from, to, property);
const boolean = (property, discriminator) => new Boolean(property, discriminator);
const s64 = (property) => new Int64(property);
const u64 = (property) => new UInt64(property);
const u128 = (property) => new UInt128(property);
const option = (kind, property, discriminator) => new Option(kind, property, discriminator);
const publicKey = (property) => new PublicKeyLayout(property);
const bytes = blob;
export { Layout, withskip, withconverter, blob, bytes, boolean, s8, u8, s16, u16, s32, u32, s64, u64, u128, seq, offset, struct, union, option, publicKey, };
export default {
    Layout,
    withskip,
    withconverter,
    blob,
    bytes,
    boolean,
    s8,
    u8,
    s16,
    u16,
    s32,
    u32,
    s64,
    u64,
    u128,
    seq,
    offset,
    struct,
    union,
    option,
    publicKey,
};
