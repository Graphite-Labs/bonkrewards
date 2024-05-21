import {
	Layout,
	blob,
	offset,
	s8,
	u8,
	s16,
	u16,
	s32,
	u32,
	seq,
	struct,
	union,
} from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";

export class InvalidSpanError extends Error {
	constructor() {
		super("Span should be more than 0");
	}
}

class WithSkip<T> extends Layout<T> {
	skip: number;
	inner: Layout<T>;

	constructor(skip: number, inner: Layout<T>, property?: string) {
		if (inner.span >= 0) super(skip + inner.span, property ?? inner.property);
		else super(-1, property ?? inner.property);
		this.skip = skip;
		this.inner = inner;
	}

	getSpan(b: Uint8Array, offset: number = 0): number {
		if (this.span >= 0) return this.span;

		return this.skip + this.inner.getSpan(b, offset + this.skip);
	}

	decode(b: Uint8Array, offset: number = 0): T {
		return this.inner.decode(b, offset + this.skip);
	}

	encode(src: T, b: Uint8Array, offset: number = 0): number {
		return this.skip + this.inner.encode(src, b, offset + this.skip);
	}
}

class WithConverter<T, F> extends Layout<T> {
	inner: Layout<F>;
	from: (arg0: F) => T;
	to: (arg0: T) => F;

	constructor(
		inner: Layout<F>,
		from: (arg0: F) => T,
		to: (arg0: T) => F,
		property?: string,
	) {
		super(inner.span, property);
		this.inner = inner;
		this.from = from;
		this.to = to;
	}

	getSpan(b: Uint8Array, offset: number = 0): number {
		return this.inner.getSpan(b, offset);
	}

	decode(b: Uint8Array, offset: number = 0): T {
		return this.from(this.inner.decode(b, offset));
	}

	encode(src: T, b: Uint8Array, offset: number = 0): number {
		return this.inner.encode(this.to(src), b, offset);
	}
}

class Boolean extends Layout<boolean> {
	static defaultDiscriminator = u8();
	discriminator: Layout<number>;

	constructor(property?: string, discriminator?: Layout<number>) {
		let real = discriminator ?? Boolean.defaultDiscriminator;
		if (real.span < 1) throw new InvalidSpanError();
		super(real.span, property);
		this.discriminator = real;
	}

	decode(b: Uint8Array, offset: number = 0): boolean {
		return this.discriminator.decode(b, offset) !== 0;
	}

	encode(src: boolean, b: Uint8Array, offset: number = 0): number {
		return this.discriminator.encode(Number(src), b, offset);
	}
}

class Int64 extends Layout<bigint> {
	constructor(property?: string) {
		super(8, property);
	}

	decode(b: Uint8Array, offset: number = 0): bigint {
		return new DataView(b.buffer, b.byteOffset).getBigInt64(offset, true);
	}

	encode(src: bigint, b: Uint8Array, offset: number = 0): number {
		new DataView(b.buffer, b.byteOffset).setBigInt64(offset, src, true);
		return this.span;
	}
}

class UInt64 extends Layout<bigint> {
	constructor(property?: string) {
		super(8, property);
	}

	decode(b: Uint8Array, offset: number = 0): bigint {
		return new DataView(b.buffer, b.byteOffset).getBigUint64(offset, true);
	}

	encode(src: bigint, b: Uint8Array, offset: number = 0): number {
		new DataView(b.buffer, b.byteOffset).setBigUint64(offset, src, true);
		return this.span;
	}
}

class UInt128 extends Layout<bigint> {
	constructor(property?: string) {
		super(16, property);
	}

	decode(b: Uint8Array, offset: number = 0): bigint {
		const dv = new DataView(b.buffer, b.byteOffset);
		const x = dv.getBigUint64(offset, true);
		const y = dv.getBigUint64(offset + 8, true);
		return (y << 64n) + x;
	}

	encode(src: bigint, b: Uint8Array, offset: number = 0): number {
		const dv = new DataView(b.buffer, b.byteOffset);
		dv.setBigUint64(offset, (src >> 64n) & (1n << (64n - 1n)), true);
		dv.setBigUint64(offset, src & (1n << (64n - 1n)), true);
		return this.span;
	}
}

class Option<T> extends Layout<T | null> {
	static defaultDiscriminator = u8();
	discriminator: Layout<number>;
	inner: Layout<T>;

	constructor(
		inner: Layout<T>,
		property?: string,
		discriminator?: Layout<number>,
	) {
		super(-1, property);
		this.discriminator = discriminator ?? Option.defaultDiscriminator;
		if (this.discriminator.span < 1) throw new InvalidSpanError();
		this.inner = inner;
	}

	getSpan(b: Uint8Array, offset: number = 0): number {
		let span = this.discriminator.span;

		if (this.discriminator.decode(b, offset) !== 0)
			span += this.inner.getSpan(b, offset + this.discriminator.span);

		return span;
	}

	decode(b: Uint8Array, offset: number = 0): T | null {
		if (this.discriminator.decode(b, offset) !== 0)
			return this.inner.decode(b, offset + this.discriminator.span);
		else return null;
	}

	encode(src: T | null, b: Uint8Array, offset: number = 0): number {
		if (src !== null)
			return (
				this.discriminator.encode(1, b, offset) +
				this.inner.encode(src, b, offset + this.discriminator.span)
			);
		else return this.discriminator.encode(0, b, offset);
	}
}

class PublicKeyLayout extends Layout<PublicKey> {
	constructor(property?: string) {
		super(32, property);
	}

	decode(b: Uint8Array, offset: number = 0): PublicKey {
		return new PublicKey(b.subarray(offset, offset + this.span));
	}

	encode(src: PublicKey, b: Uint8Array, offset: number = 0): number {
		b.set(src.toBytes(), offset);
		return this.span;
	}
}

const withskip = <T>(skip: number, inner: Layout<T>, property?: string) =>
	new WithSkip(skip, inner, property);
const withconverter = <T, F>(
	inner: Layout<F>,
	from: (arg0: F) => T,
	to: (arg0: T) => F,
	property?: string,
) => new WithConverter(inner, from, to, property);
const boolean = (property?: string, discriminator?: Layout<number>) =>
	new Boolean(property, discriminator);
const s64 = (property?: string) => new Int64(property);
const u64 = (property?: string) => new UInt64(property);
const u128 = (property?: string) => new UInt128(property);
const option = <T>(
	kind: Layout<T>,
	property?: string,
	discriminator?: Layout<number>,
) => new Option(kind, property, discriminator);
const publicKey = (property?: string) => new PublicKeyLayout(property);
const bytes = blob;

export {
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
