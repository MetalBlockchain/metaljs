import { bls12_381 } from '@noble/curves/bls12-381';
import type { ProjPointType } from '@noble/curves/abstract/weierstrass';
import { Buffer } from "buffer/"

export const PUBLIC_KEY_LENGTH = 48;
export const SIGNATURE_LENGTH = 96;

export type PublicKey = ProjPointType<bigint>;
export type Signature = ProjPointType<typeof bls12_381.fields.Fp2.ZERO>;
export type Message = ProjPointType<typeof bls12_381.fields.Fp2.ZERO>;

const signatureDST = 'BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_';
const popDST = 'BLS_POP_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_';

export function publicKeyFromBytes(pkBytes: Buffer): PublicKey {
    return bls12_381.G1.ProjectivePoint.fromHex(pkBytes);
}

export function signatureFromBytes(sigBytes: Buffer): Signature {
    return bls12_381.Signature.fromHex(sigBytes);
}

export function verifyProofOfPossession(
  pk: PublicKey,
  sig: Signature,
  msg: Uint8Array | string | Message,
): boolean {
  return bls12_381.verify(sig, msg, pk, {
      DST: popDST,
  });
}