import { Dimensions, FeeDimensions } from "./dimensions";

export const LONG_LEN = 8;
export const INT_LEN = 4;
export const SHORT_LEN = 2;
export const SHORT_ID_LEN = 20;
export const ID_LEN = 32;
export const SIGNATURE_LENGTH = 65;
export const PUBLIC_KEY_LENGTH = 48;
export const BLS_SIGNATURE_LENGTH = 96;

export const INTRINSIC_INPUT_DB_READ = 1;
export const INTRINSIC_INPUT_DB_WRITE = 1;
export const INTRINSIC_INPUT_BANDWIDTH =
  ID_LEN + // txID
  INT_LEN + // output index
  ID_LEN + // assetID
  INT_LEN + // input typeID
  INT_LEN; // credential typeID

export const INTRINSIC_OUTPUT_BANDWIDTH =
  ID_LEN + // assetID
  INT_LEN; // output typeID

export const INTRINSIC_OUTPUT_DB_WRITE = 1;

export const INTRINSIC_SECP256K1_FX_OUTPUT_OWNERS_BANDWIDTH =
  LONG_LEN + // locktime
  INT_LEN + // threshold
  INT_LEN; // number of addresses

export const INTRINSIC_SECP256K1_FX_INPUT_BANDWIDTH =
  INT_LEN + // num indices
  INT_LEN; // num signatures

export const INTRINSIC_SECP256K1_FX_TRANSFERABLE_INPUT_BANDWIDTH =
  LONG_LEN + // amount
  INTRINSIC_SECP256K1_FX_INPUT_BANDWIDTH;

export const INTRINSIC_SECP256K1_FX_OUTPUT_BANDWIDTH =
  LONG_LEN + // amount
  INTRINSIC_SECP256K1_FX_OUTPUT_OWNERS_BANDWIDTH;

export const INTRINSIC_STAKEABLE_LOCKED_OUTPUT_BANDWIDTH =
  LONG_LEN + // locktime
  INT_LEN; // output typeID

export const INTRINSIC_STAKEABLE_LOCKED_INPUT_BANDWIDTH =
  LONG_LEN + // locktime
  INT_LEN; // input typeID

export const INTRINSIC_SECP256K1_FX_SIGNATURE_BANDWIDTH =
  INT_LEN + // Signature index
  SIGNATURE_LENGTH; // Signature

export const INTRINSIC_SECP256K1_FX_SIGNATURE_COMPUTE = 200;

export const INTRINSIC_POP_BANDWIDTH =
  PUBLIC_KEY_LENGTH + // Public key
  BLS_SIGNATURE_LENGTH; // Signature

export const INTRINSIC_VALIDATOR_BANDWIDTH =
  SHORT_ID_LEN + // Node ID (Short ID = 20)
  LONG_LEN + // Start
  LONG_LEN + // End
  LONG_LEN; // Weight

export const INTRINSIC_BLS_AGGREGATE_COMPUTE = 5; // BLS public key aggregation time is around 5 us
export const INTRINSIC_BLS_VERIFY_COMPUTE = 1_000; // BLS verification time is around 1000us
export const INTRINSIC_BLS_PUBLIC_KEY_VALIDATION_COMPUTE = 50; // BLS public key validation time is around 50us
export const INTRINSIC_BLS_POP_VERIFY_COMPUTE = INTRINSIC_BLS_PUBLIC_KEY_VALIDATION_COMPUTE + INTRINSIC_BLS_VERIFY_COMPUTE;

// Transaction types
export const INTRINSIC_BASE_TX_COMPLEXITIES: Dimensions = {
    [FeeDimensions.Bandwidth]:
      SHORT_LEN + // codec version
      INT_LEN + // typeID
      INT_LEN + // networkID
      ID_LEN + // blockchainID
      INT_LEN + // number of outputs
      INT_LEN + // number of inputs
      INT_LEN + // length of memo
      INT_LEN, // number of credentials
    [FeeDimensions.DBRead]: 0,
    [FeeDimensions.DBWrite]: 0,
    [FeeDimensions.Compute]: 0,
};

export const INTRINSIC_IMPORT_TX_COMPLEXITIES: Dimensions = {
    [FeeDimensions.Bandwidth]:
      INTRINSIC_BASE_TX_COMPLEXITIES[FeeDimensions.Bandwidth] +
      ID_LEN + // source chain ID
      INT_LEN, // num imported inputs
    [FeeDimensions.DBRead]: 0,
    [FeeDimensions.DBWrite]: 0,
    [FeeDimensions.Compute]: 0,
};

export const INTRINSIC_EXPORT_TX_COMPLEXITIES: Dimensions = {
    [FeeDimensions.Bandwidth]:
      INTRINSIC_BASE_TX_COMPLEXITIES[FeeDimensions.Bandwidth] +
      ID_LEN + // destination chain ID
      INT_LEN, // num exported outputs
    [FeeDimensions.DBRead]: 0,
    [FeeDimensions.DBWrite]: 0,
    [FeeDimensions.Compute]: 0,
};

export const INTRINSIC_ADD_PERMISSIONLESS_VALIDATOR_TX_COMPLEXITIES: Dimensions = {
    [FeeDimensions.Bandwidth]:
      INTRINSIC_BASE_TX_COMPLEXITIES[FeeDimensions.Bandwidth] +
      INTRINSIC_VALIDATOR_BANDWIDTH + // Validator
      ID_LEN + // Subnet ID
      INT_LEN + // Signer typeID
      INT_LEN + // Num stake outs
      INT_LEN + // Validator rewards typeID
      INT_LEN + // Delegator rewards typeID
      INT_LEN, // Delegation shares
    [FeeDimensions.DBRead]: 1, // get staking config
    [FeeDimensions.DBWrite]: 3, // put current staker + write weight diff + write pk diff
    [FeeDimensions.Compute]: 0,
};

export const INTRINSIC_ADD_PERMISSIONLESS_DELEGATOR_TX_COMPLEXITIES: Dimensions = {
    [FeeDimensions.Bandwidth]:
      INTRINSIC_BASE_TX_COMPLEXITIES[FeeDimensions.Bandwidth] +
      INTRINSIC_VALIDATOR_BANDWIDTH + // Validator
      ID_LEN + // Subnet ID
      INT_LEN + // Num stake outs
      INT_LEN, // Delegator rewards typeID
    [FeeDimensions.DBRead]: 1, // get staking config
    [FeeDimensions.DBWrite]: 2, // put current staker + write weight diff
    [FeeDimensions.Compute]: 0,
};