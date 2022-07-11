/**
 * @packageDocumentation
 * @module Utils-Constants
 */

import BN from "bn.js"

export const PrivateKeyPrefix: string = "PrivateKey-"
export const NodeIDPrefix: string = "NodeID-"
export const PrimaryAssetAlias: string = "METAL"
export const MainnetAPI: string = "bd5afdaa6ab3.ngrok.io"
export const FujiAPI: string = "api.avax-test.network"

export interface C {
  blockchainID: string
  alias: string
  vm: string
  fee?: BN
  gasPrice: BN | number
  chainID?: number
  minGasPrice?: BN
  maxGasPrice?: BN
  txBytesGas?: number
  costPerSignature?: number
  txFee?: BN
  avaxAssetID?: string
}
export interface X {
  blockchainID: string
  alias: string
  vm: string
  creationTxFee: BN | number
  mintTxFee: BN
  avaxAssetID?: string
  txFee?: BN | number
  fee?: BN
}
export interface P {
  blockchainID: string
  alias: string
  vm: string
  creationTxFee: BN | number
  createSubnetTx: BN | number
  createChainTx: BN | number
  minConsumption: number
  maxConsumption: number
  maxStakingDuration: BN
  maxSupply: BN
  minStake: BN
  minStakeDuration: number
  maxStakeDuration: number
  minDelegationStake: BN
  minDelegationFee: BN
  avaxAssetID?: string
  txFee?: BN | number
  fee?: BN
}
export interface Network {
  C: C
  hrp: string
  X: X
  P: P
  [key: string]: C | X | P | string
}
export interface Networks {
  [key: number]: Network
}

export const NetworkIDToHRP: object = {
  0: "custom",
  1191772: "metal",
  2: "cascade",
  3: "denali",
  4: "everest",
  1191773: "testnet",
  1337: "custom",
  12345: "local"
}

export const HRPToNetworkID: object = {
  manhattan: 0,
  metal: 1191772,
  cascade: 2,
  denali: 3,
  everest: 4,
  testnet: 1191773,
  custom: 1337,
  local: 12345
}

export const NetworkIDToNetworkNames: object = {
  0: ["Manhattan"],
  1191772: ["Metal", "Mainnet"],
  2: ["Cascade"],
  3: ["Denali"],
  4: ["Everest"],
  1191773: ["Testnet"],
  1337: ["Custom Network"],
  12345: ["Local Network"]
}

export const NetworkNameToNetworkID: object = {
  Manhattan: 0,
  Metal: 1191772,
  Mainnet: 1191772,
  Cascade: 2,
  Denali: 3,
  Everest: 4,
  Fuji: 1191773,
  Testnet: 1191773,
  Custom: 1337,
  "Custom Network": 1337,
  Local: 12345,
  "Local Network": 12345
}

export const FallbackHRP: string = "custom"
export const FallbackNetworkName: string = "Custom Network"
export const FallbackEVMChainID: number = 43112

export const DefaultNetworkID: number = 1191772

export const PlatformChainID: string = "11111111111111111111111111111111LpoYY"
export const PrimaryNetworkID: string = "11111111111111111111111111111111LpoYY"
export const XChainAlias: string = "X"
export const CChainAlias: string = "C"
export const PChainAlias: string = "P"
export const XChainVMName: string = "avm"
export const CChainVMName: string = "evm"
export const PChainVMName: string = "platformvm"

// DO NOT use the following private keys and/or mnemonic on Fuji or Testnet
// This address/account is for testing on the local avash network
export const DefaultLocalGenesisPrivateKey: string =
  "ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
export const DefaultEVMLocalGenesisPrivateKey: string =
  "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"
export const DefaultEVMLocalGenesisAddress: string =
  "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
export const mnemonic: string =
  "output tooth keep tooth bracket fox city sustain blood raise install pond stem reject long scene clap gloom purpose mean music piece unknown light"

export const ONEAVAX: BN = new BN(1000000000)

export const DECIAVAX: BN = ONEAVAX.div(new BN(10))

export const CENTIAVAX: BN = ONEAVAX.div(new BN(100))

export const MILLIAVAX: BN = ONEAVAX.div(new BN(1000))

export const MICROAVAX: BN = ONEAVAX.div(new BN(1000000))

export const NANOAVAX: BN = ONEAVAX.div(new BN(1000000000))

export const WEI: BN = new BN(1)

export const GWEI: BN = WEI.mul(new BN(1000000000))

export const AVAXGWEI: BN = NANOAVAX.clone()

export const AVAXSTAKECAP: BN = ONEAVAX.mul(new BN(3000000))

// Start Manhattan
const n0X: X = {
  blockchainID: "2vrXWHgGxh5n3YsLHMV16YVVJTpT4z45Fmb4y3bL6si8kLCyg9",
  alias: XChainAlias,
  vm: XChainVMName,
  fee: MILLIAVAX,
  creationTxFee: CENTIAVAX,
  mintTxFee: MILLIAVAX
}

const n0P: P = {
  blockchainID: PlatformChainID,
  alias: PChainAlias,
  vm: PChainVMName,
  fee: MILLIAVAX,
  creationTxFee: CENTIAVAX,
  createSubnetTx: ONEAVAX,
  createChainTx: ONEAVAX,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(31536000),
  maxSupply: new BN(720000000).mul(ONEAVAX),
  minStake: ONEAVAX.mul(new BN(2000)),
  minStakeDuration: 2 * 7 * 24 * 60 * 60, //two weeks
  maxStakeDuration: 365 * 24 * 60 * 60, // one year
  minDelegationStake: ONEAVAX.mul(new BN(25)),
  minDelegationFee: new BN(2)
}

const n0C: C = {
  blockchainID: "2fFZQibQXcd6LTE4rpBPBAkLVXFE91Kit8pgxaBG1mRnh5xqbb",
  alias: CChainAlias,
  vm: CChainVMName,
  fee: MILLIAVAX,
  gasPrice: GWEI.mul(new BN(470)), //equivalent to gas price
  chainID: 43111
}
// End Manhattan

// Start mainnet
let avaxAssetID: string = "DWH2QvATv1dfpZvR6y9XQ8Gj6gXiorW6UJjc4dEEtcukENimv"
const n1X: X = {
  blockchainID: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
  avaxAssetID: avaxAssetID,
  alias: XChainAlias,
  vm: XChainVMName,
  txFee: MILLIAVAX,
  creationTxFee: CENTIAVAX,
  mintTxFee: MILLIAVAX
}

const n1P: P = {
  blockchainID: PlatformChainID,
  avaxAssetID: avaxAssetID,
  alias: PChainAlias,
  vm: PChainVMName,
  txFee: MILLIAVAX,
  createSubnetTx: ONEAVAX,
  createChainTx: ONEAVAX,
  creationTxFee: CENTIAVAX,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(31536000),
  maxSupply: new BN(720000000).mul(ONEAVAX),
  minStake: ONEAVAX.mul(new BN(2000)),
  minStakeDuration: 2 * 7 * 24 * 60 * 60, //two weeks
  maxStakeDuration: 365 * 24 * 60 * 60, // one year
  minDelegationStake: ONEAVAX.mul(new BN(25)),
  minDelegationFee: new BN(2)
}

const n1C: C = {
  blockchainID: "2fJ5SRp51iZfrbzzGsWSBzphY9onEuhae7T5iXmiW32FytdsMU",
  alias: CChainAlias,
  vm: CChainVMName,
  txBytesGas: 1,
  costPerSignature: 1000,
  // DEPRECATED - txFee
  // WILL BE REMOVED IN NEXT MAJOR VERSION BUMP
  txFee: MILLIAVAX,
  // DEPRECATED - gasPrice
  // WILL BE REMOVED IN NEXT MAJOR VERSION BUMP
  gasPrice: GWEI.mul(new BN(225)),
  minGasPrice: GWEI.mul(new BN(25)),
  maxGasPrice: GWEI.mul(new BN(1000)),
  chainID: 43114
}
// End Mainnet

// Start Cascade
const n2X: X = {
  blockchainID: "4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM",
  alias: XChainAlias,
  vm: XChainVMName,
  txFee: 0,
  creationTxFee: 0,
  mintTxFee: new BN(0)
}

const n2P: P = {
  blockchainID: PlatformChainID,
  alias: PChainAlias,
  vm: PChainVMName,
  txFee: 0,
  creationTxFee: 0,
  createSubnetTx: ONEAVAX,
  createChainTx: ONEAVAX,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(31536000),
  maxSupply: new BN(720000000).mul(ONEAVAX),
  minStake: ONEAVAX.mul(new BN(2000)),
  minStakeDuration: 2 * 7 * 24 * 60 * 60, //two weeks
  maxStakeDuration: 365 * 24 * 60 * 60, // one year
  minDelegationStake: ONEAVAX.mul(new BN(25)),
  minDelegationFee: new BN(2)
}

const n2C: C = {
  blockchainID: "2mUYSXfLrDtigwbzj1LxKVsHwELghc5sisoXrzJwLqAAQHF4i",
  alias: CChainAlias,
  vm: CChainVMName,
  gasPrice: 0
}
// End Cascade

// Start Denali
const n3X: X = {
  blockchainID: "rrEWX7gc7D9mwcdrdBxBTdqh1a7WDVsMuadhTZgyXfFcRz45L",
  alias: XChainAlias,
  vm: XChainVMName,
  txFee: 0,
  creationTxFee: 0,
  mintTxFee: new BN(0)
}

const n3P: P = {
  blockchainID: "",
  alias: PChainAlias,
  vm: PChainVMName,
  txFee: 0,
  creationTxFee: 0,
  createSubnetTx: ONEAVAX,
  createChainTx: ONEAVAX,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(31536000),
  maxSupply: new BN(720000000).mul(ONEAVAX),
  minStake: ONEAVAX.mul(new BN(2000)),
  minStakeDuration: 2 * 7 * 24 * 60 * 60, //two weeks
  maxStakeDuration: 365 * 24 * 60 * 60, // one year
  minDelegationStake: ONEAVAX.mul(new BN(25)),
  minDelegationFee: new BN(2)
}

const n3C: C = {
  blockchainID: "zJytnh96Pc8rM337bBrtMvJDbEdDNjcXG3WkTNCiLp18ergm9",
  alias: CChainAlias,
  vm: CChainVMName,
  gasPrice: 0
}
// End Denali

// Start Everest
const n4X: X = {
  blockchainID: "jnUjZSRt16TcRnZzmh5aMhavwVHz3zBrSN8GfFMTQkzUnoBxC",
  alias: XChainAlias,
  vm: XChainVMName,
  txFee: MILLIAVAX,
  creationTxFee: CENTIAVAX,
  mintTxFee: MILLIAVAX
}

const n4P: P = {
  blockchainID: PlatformChainID,
  alias: PChainAlias,
  vm: PChainVMName,
  txFee: MILLIAVAX,
  creationTxFee: CENTIAVAX,
  createSubnetTx: ONEAVAX,
  createChainTx: ONEAVAX,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(31536000),
  maxSupply: new BN(720000000).mul(ONEAVAX),
  minStake: ONEAVAX.mul(new BN(2000)),
  minStakeDuration: 2 * 7 * 24 * 60 * 60, //two weeks
  maxStakeDuration: 365 * 24 * 60 * 60, // one year
  minDelegationStake: ONEAVAX.mul(new BN(25)),
  minDelegationFee: new BN(2)
}

const n4C: C = {
  blockchainID: "saMG5YgNsFxzjz4NMkEkt3bAH6hVxWdZkWcEnGB3Z15pcAmsK",
  alias: CChainAlias,
  vm: CChainVMName,
  gasPrice: GWEI.mul(new BN(470)),
  chainID: 43110
}
// End Everest

// Start Fuji
avaxAssetID = "22isChTFe6CZnCCj5Kbi6S5efvooPAtUtkzZScGXsvoE5jczDZ"
const n5X: X = {
  blockchainID: "2aBeLFAUpXPN8d7Uj52jUD8uqR2to6YvNSmEotpT35WHFC4Ufy",
  avaxAssetID: avaxAssetID,
  alias: XChainAlias,
  vm: XChainVMName,
  txFee: MILLIAVAX,
  creationTxFee: CENTIAVAX,
  mintTxFee: MILLIAVAX
}

const n5P: P = {
  blockchainID: PlatformChainID,
  avaxAssetID: avaxAssetID,
  alias: PChainAlias,
  vm: PChainVMName,
  txFee: MILLIAVAX,
  creationTxFee: CENTIAVAX,
  createSubnetTx: ONEAVAX,
  createChainTx: ONEAVAX,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(31536000),
  maxSupply: new BN(720000000).mul(ONEAVAX),
  minStake: ONEAVAX,
  minStakeDuration: 24 * 60 * 60, //one day
  maxStakeDuration: 365 * 24 * 60 * 60, // one year
  minDelegationStake: ONEAVAX,
  minDelegationFee: new BN(2)
}

const n5C: C = {
  blockchainID: "mfX8E5nPLnxfHi2oYSaUoh4TqdKpW51pijSXB5txBot2APchN",
  alias: CChainAlias,
  vm: CChainVMName,
  txBytesGas: 1,
  costPerSignature: 1000,
  // DEPRECATED - txFee
  // WILL BE REMOVED IN NEXT MAJOR VERSION BUMP
  txFee: MILLIAVAX,
  // DEPRECATED - gasPrice
  // WILL BE REMOVED IN NEXT MAJOR VERSION BUMP
  gasPrice: GWEI.mul(new BN(225)),
  minGasPrice: GWEI.mul(new BN(25)),
  maxGasPrice: GWEI.mul(new BN(1000)),
  chainID: 43113
}
// End Fuji

// Start custom network
avaxAssetID = "BUuypiq2wyuLMvyhzFXcPyxPMCgSp7eeDohhQRqTChoBjKziC"
const n1337X: X = { ...n5X }
n1337X.blockchainID = "qzfF3A11KzpcHkkqznEyQgupQrCNS6WV6fTUTwZpEKqhj1QE7"
n1337X.avaxAssetID = avaxAssetID
const n1337P: P = { ...n5P }
n1337P.blockchainID = PlatformChainID
const n1337C: C = { ...n5C }
n1337C.blockchainID = "BR28ypgLATNS6PbtHMiJ7NQ61vfpT27Hj8tAcZ1AHsfU5cz88"
n1337C.avaxAssetID = avaxAssetID
n1337C.chainID = 43112
// End custom network

// Start local network
avaxAssetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"
const n12345X: X = { ...n5X }
n12345X.blockchainID = "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"
n12345X.avaxAssetID = avaxAssetID
const n12345P: P = { ...n5P }
n12345P.blockchainID = PlatformChainID
const n12345C: C = { ...n5C }
n12345C.blockchainID = "2CA6j5zYzasynPsFeNoqWkmTCt3VScMvXUZHbfDJ8k3oGzAPtU"
n12345C.avaxAssetID = avaxAssetID
n12345C.chainID = 43112
// End local network

export class Defaults {
  static network: Networks = {
    0: {
      hrp: NetworkIDToHRP[0],
      X: n0X,
      "2vrXWHgGxh5n3YsLHMV16YVVJTpT4z45Fmb4y3bL6si8kLCyg9": n0X,
      P: n0P,
      "11111111111111111111111111111111LpoYY": n0P,
      C: n0C,
      "2fFZQibQXcd6LTE4rpBPBAkLVXFE91Kit8pgxaBG1mRnh5xqbb": n0C
    },
    1191772: {
      hrp: NetworkIDToHRP[1191772],
      X: n1X,
      "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM": n1X,
      P: n1P,
      "11111111111111111111111111111111LpoYY": n1P,
      C: n1C,
      "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5": n1C
    },
    2: {
      hrp: NetworkIDToHRP[2],
      X: n2X,
      "4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM": n2X,
      P: n2P,
      "11111111111111111111111111111111LpoYY": n2P,
      C: n2C,
      "2mUYSXfLrDtigwbzj1LxKVsHwELghc5sisoXrzJwLqAAQHF4i": n2C
    },
    3: {
      hrp: NetworkIDToHRP[3],
      X: n3X,
      rrEWX7gc7D9mwcdrdBxBTdqh1a7WDVsMuadhTZgyXfFcRz45L: n3X,
      P: n3P,
      "11111111111111111111111111111111LpoYY": n3P,
      C: n3C,
      zJytnh96Pc8rM337bBrtMvJDbEdDNjcXG3WkTNCiLp18ergm9: n3C
    },
    4: {
      hrp: NetworkIDToHRP[4],
      X: n4X,
      jnUjZSRt16TcRnZzmh5aMhavwVHz3zBrSN8GfFMTQkzUnoBxC: n4X,
      P: n4P,
      "11111111111111111111111111111111LpoYY": n4P,
      C: n4C,
      saMG5YgNsFxzjz4NMkEkt3bAH6hVxWdZkWcEnGB3Z15pcAmsK: n4C
    },
    1191773: {
      hrp: NetworkIDToHRP[1191773],
      X: n5X,
      "2aBeLFAUpXPN8d7Uj52jUD8uqR2to6YvNSmEotpT35WHFC4Ufy": n5X,
      P: n5P,
      "11111111111111111111111111111111LpoYY": n5P,
      C: n5C,
      "mfX8E5nPLnxfHi2oYSaUoh4TqdKpW51pijSXB5txBot2APchN": n5C
    },
    1337: {
      hrp: NetworkIDToHRP[1337],
      X: n1337X,
      qzfF3A11KzpcHkkqznEyQgupQrCNS6WV6fTUTwZpEKqhj1QE7: n1337X,
      P: n1337P,
      "11111111111111111111111111111111LpoYY": n1337P,
      C: n1337C,
      BR28ypgLATNS6PbtHMiJ7NQ61vfpT27Hj8tAcZ1AHsfU5cz88: n1337C
    },
    12345: {
      hrp: NetworkIDToHRP[12345],
      X: n12345X,
      "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed": n12345X,
      P: n12345P,
      "11111111111111111111111111111111LpoYY": n12345P,
      C: n12345C,
      "2CA6j5zYzasynPsFeNoqWkmTCt3VScMvXUZHbfDJ8k3oGzAPtU": n12345C
    }
  }
}

/**
 * Rules used when merging sets
 */
export type MergeRule =
  | "intersection" // Self INTERSECT New
  | "differenceSelf" // Self MINUS New
  | "differenceNew" // New MINUS Self
  | "symDifference" // differenceSelf UNION differenceNew
  | "union" // Self UNION New
  | "unionMinusNew" // union MINUS differenceNew
  | "unionMinusSelf" // union MINUS differenceSelf
  | "ERROR" // generate error for testing
