import { Layout, blob, offset, s8, u8, s16, u16, s32, u32, seq, struct, union } from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";
export declare class InvalidSpanError extends Error {
    constructor();
}
declare class WithSkip<T> extends Layout<T> {
    skip: number;
    inner: Layout<T>;
    constructor(skip: number, inner: Layout<T>, property?: string);
    getSpan(b: Uint8Array, offset?: number): number;
    decode(b: Uint8Array, offset?: number): T;
    encode(src: T, b: Uint8Array, offset?: number): number;
}
declare class WithConverter<T, F> extends Layout<T> {
    inner: Layout<F>;
    from: (arg0: F) => T;
    to: (arg0: T) => F;
    constructor(inner: Layout<F>, from: (arg0: F) => T, to: (arg0: T) => F, property?: string);
    getSpan(b: Uint8Array, offset?: number): number;
    decode(b: Uint8Array, offset?: number): T;
    encode(src: T, b: Uint8Array, offset?: number): number;
}
declare class Boolean extends Layout<boolean> {
    static defaultDiscriminator: import("@solana/buffer-layout").UInt;
    discriminator: Layout<number>;
    constructor(property?: string, discriminator?: Layout<number>);
    decode(b: Uint8Array, offset?: number): boolean;
    encode(src: boolean, b: Uint8Array, offset?: number): number;
}
declare class Int64 extends Layout<bigint> {
    constructor(property?: string);
    decode(b: Uint8Array, offset?: number): bigint;
    encode(src: bigint, b: Uint8Array, offset?: number): number;
}
declare class UInt64 extends Layout<bigint> {
    constructor(property?: string);
    decode(b: Uint8Array, offset?: number): bigint;
    encode(src: bigint, b: Uint8Array, offset?: number): number;
}
declare class UInt128 extends Layout<bigint> {
    constructor(property?: string);
    decode(b: Uint8Array, offset?: number): bigint;
    encode(src: bigint, b: Uint8Array, offset?: number): number;
}
declare class Option<T> extends Layout<T | null> {
    static defaultDiscriminator: import("@solana/buffer-layout").UInt;
    discriminator: Layout<number>;
    inner: Layout<T>;
    constructor(inner: Layout<T>, property?: string, discriminator?: Layout<number>);
    getSpan(b: Uint8Array, offset?: number): number;
    decode(b: Uint8Array, offset?: number): T | null;
    encode(src: T | null, b: Uint8Array, offset?: number): number;
}
declare class PublicKeyLayout extends Layout<PublicKey> {
    constructor(property?: string);
    decode(b: Uint8Array, offset?: number): PublicKey;
    encode(src: PublicKey, b: Uint8Array, offset?: number): number;
}
declare const withskip: <T>(skip: number, inner: Layout<T>, property?: string) => WithSkip<T>;
declare const withconverter: <T, F>(inner: Layout<F>, from: (arg0: F) => T, to: (arg0: T) => F, property?: string) => WithConverter<T, F>;
declare const boolean: (property?: string, discriminator?: Layout<number>) => Boolean;
declare const s64: (property?: string) => Int64;
declare const u64: (property?: string) => UInt64;
declare const u128: (property?: string) => UInt128;
declare const option: <T>(kind: Layout<T>, property?: string, discriminator?: Layout<number>) => Option<T>;
declare const publicKey: (property?: string) => PublicKeyLayout;
declare const bytes: (length: number | import("@solana/buffer-layout").ExternalLayout, property?: string | undefined) => import("@solana/buffer-layout").Blob;
export { Layout, withskip, withconverter, blob, bytes, boolean, s8, u8, s16, u16, s32, u32, s64, u64, u128, seq, offset, struct, union, option, publicKey, };
declare const _default: {
    Layout: typeof Layout;
    withskip: <T>(skip: number, inner: Layout<T>, property?: string | undefined) => WithSkip<T>;
    withconverter: <T_1, F>(inner: Layout<F>, from: (arg0: F) => T_1, to: (arg0: T_1) => F, property?: string | undefined) => WithConverter<T_1, F>;
    blob: (length: number | import("@solana/buffer-layout").ExternalLayout, property?: string | undefined) => import("@solana/buffer-layout").Blob;
    bytes: (length: number | import("@solana/buffer-layout").ExternalLayout, property?: string | undefined) => import("@solana/buffer-layout").Blob;
    boolean: (property?: string | undefined, discriminator?: Layout<number> | undefined) => Boolean;
    s8: (property?: string | undefined) => import("@solana/buffer-layout").Int;
    u8: (property?: string | undefined) => import("@solana/buffer-layout").UInt;
    s16: (property?: string | undefined) => import("@solana/buffer-layout").Int;
    u16: (property?: string | undefined) => import("@solana/buffer-layout").UInt;
    s32: (property?: string | undefined) => import("@solana/buffer-layout").Int;
    u32: (property?: string | undefined) => import("@solana/buffer-layout").UInt;
    s64: (property?: string | undefined) => Int64;
    u64: (property?: string | undefined) => UInt64;
    u128: (property?: string | undefined) => UInt128;
    seq: <T_2>(elementLayout: Layout<T_2>, count: number | import("@solana/buffer-layout").ExternalLayout, property?: string | undefined) => import("@solana/buffer-layout").Sequence<T_2>;
    offset: (layout: Layout<number>, offset?: number | undefined, property?: string | undefined) => import("@solana/buffer-layout").OffsetLayout;
    struct: <T_3>(fields: Layout<T_3[keyof T_3]>[], property?: string | undefined, decodePrefixes?: boolean | undefined) => import("@solana/buffer-layout").Structure<T_3>;
    union: (discr: import("@solana/buffer-layout").ExternalLayout | import("@solana/buffer-layout").UInt | import("@solana/buffer-layout").UIntBE | import("@solana/buffer-layout").UnionDiscriminator<any>, defaultLayout?: Layout<import("@solana/buffer-layout").LayoutObject> | null | undefined, property?: string | undefined) => import("@solana/buffer-layout").Union;
    option: <T_4>(kind: Layout<T_4>, property?: string | undefined, discriminator?: Layout<number> | undefined) => Option<T_4>;
    publicKey: (property?: string | undefined) => PublicKeyLayout;
};
export default _default;
