/**
 * @packageDocumentation
 * @module API-PlatformVM-ValidationTx
 */

import BN from "bn.js"
import BinTools from "../../utils/bintools"
import { BaseTx } from "./basetx"
import { TransferableOutput } from "../platformvm/outputs"
import { TransferableInput } from "../platformvm/inputs"
import { Buffer } from "buffer/"
import { PlatformVMConstants } from "./constants"
import { DefaultNetworkID } from "../../utils/constants"
import { bufferToNodeIDString } from "../../utils/helperfunctions"
import { AmountOutput, ParseableOutput } from "./outputs"
import { Serialization, SerializedEncoding } from "../../utils/serialization"
import { DelegationFeeError } from "../../utils/errors"

/**
 * @ignore
 */
const bintools: BinTools = BinTools.getInstance()
const serialization: Serialization = Serialization.getInstance()

/**
 * Abstract class representing an transactions with validation information.
 */
export abstract class ValidatorTx extends BaseTx {
  protected _typeName = "ValidatorTx"
  protected _typeID = undefined

  serialize(encoding: SerializedEncoding = "hex"): object {
    let fields: object = super.serialize(encoding)
    return {
      ...fields,
      nodeID: serialization.encoder(this.nodeID, encoding, "Buffer", "nodeID"),
      startTime: serialization.encoder(
        this.startTime,
        encoding,
        "Buffer",
        "decimalString"
      ),
      endTime: serialization.encoder(
        this.endTime,
        encoding,
        "Buffer",
        "decimalString"
      )
    }
  }
  deserialize(fields: object, encoding: SerializedEncoding = "hex") {
    super.deserialize(fields, encoding)
    this.nodeID = serialization.decoder(
      fields["nodeID"],
      encoding,
      "nodeID",
      "Buffer",
      20
    )
    this.startTime = serialization.decoder(
      fields["startTime"],
      encoding,
      "decimalString",
      "Buffer",
      8
    )
    this.endTime = serialization.decoder(
      fields["endTime"],
      encoding,
      "decimalString",
      "Buffer",
      8
    )
  }

  protected nodeID: Buffer = Buffer.alloc(20)
  protected startTime: Buffer = Buffer.alloc(8)
  protected endTime: Buffer = Buffer.alloc(8)

  /**
   * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
   */
  getNodeID(): Buffer {
    return this.nodeID
  }

  /**
   * Returns a string for the nodeID amount.
   */
  getNodeIDString(): string {
    return bufferToNodeIDString(this.nodeID)
  }
  /**
   * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
   */
  getStartTime() {
    return bintools.fromBufferToBN(this.startTime)
  }

  /**
   * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
   */
  getEndTime() {
    return bintools.fromBufferToBN(this.endTime)
  }

  fromBuffer(bytes: Buffer, offset: number = 0): number {
    offset = super.fromBuffer(bytes, offset)
    this.nodeID = bintools.copyFrom(bytes, offset, offset + 20)
    offset += 20
    this.startTime = bintools.copyFrom(bytes, offset, offset + 8)
    offset += 8
    this.endTime = bintools.copyFrom(bytes, offset, offset + 8)
    offset += 8
    return offset
  }

  /**
   * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ValidatorTx]].
   */
  toBuffer(): Buffer {
    const superbuff: Buffer = super.toBuffer()
    const bsize: number =
      superbuff.length +
      this.nodeID.length +
      this.startTime.length +
      this.endTime.length
    return Buffer.concat(
      [superbuff, this.nodeID, this.startTime, this.endTime],
      bsize
    )
  }

  constructor(
    networkID: number,
    blockchainID: Buffer,
    outs: TransferableOutput[],
    ins: TransferableInput[],
    memo?: Buffer,
    nodeID?: Buffer,
    startTime?: BN,
    endTime?: BN
  ) {
    super(networkID, blockchainID, outs, ins, memo)
    this.nodeID = nodeID
    this.startTime = bintools.fromBNToBuffer(startTime, 8)
    this.endTime = bintools.fromBNToBuffer(endTime, 8)
  }
}

export abstract class WeightedValidatorTx extends ValidatorTx {
  protected _typeName = "WeightedValidatorTx"
  protected _typeID = undefined

  serialize(encoding: SerializedEncoding = "hex"): object {
    let fields: object = super.serialize(encoding)
    return {
      ...fields,
      weight: serialization.encoder(
        this.weight,
        encoding,
        "Buffer",
        "decimalString"
      )
    }
  }
  deserialize(fields: object, encoding: SerializedEncoding = "hex") {
    super.deserialize(fields, encoding)
    this.weight = serialization.decoder(
      fields["weight"],
      encoding,
      "decimalString",
      "Buffer",
      8
    )
  }

  protected weight: Buffer = Buffer.alloc(8)

  /**
   * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
   */
  getWeight(): BN {
    return bintools.fromBufferToBN(this.weight)
  }

  /**
   * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
   */
  getWeightBuffer(): Buffer {
    return this.weight
  }

  fromBuffer(bytes: Buffer, offset: number = 0): number {
    offset = super.fromBuffer(bytes, offset)
    this.weight = bintools.copyFrom(bytes, offset, offset + 8)
    offset += 8
    return offset
  }

  /**
   * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[AddSubnetValidatorTx]].
   */
  toBuffer(): Buffer {
    const superbuff: Buffer = super.toBuffer()
    return Buffer.concat([superbuff, this.weight])
  }

  /**
   * Class representing an unsigned AddSubnetValidatorTx transaction.
   *
   * @param networkID Optional. Networkid, [[DefaultNetworkID]]
   * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
   * @param outs Optional. Array of the [[TransferableOutput]]s
   * @param ins Optional. Array of the [[TransferableInput]]s
   * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
   * @param nodeID Optional. The node ID of the validator being added.
   * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
   * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
   * @param weight Optional. The amount of nAVAX the validator is staking.
   */
  constructor(
    networkID: number = DefaultNetworkID,
    blockchainID: Buffer = Buffer.alloc(32, 16),
    outs: TransferableOutput[] = undefined,
    ins: TransferableInput[] = undefined,
    memo: Buffer = undefined,
    nodeID: Buffer = undefined,
    startTime: BN = undefined,
    endTime: BN = undefined,
    weight: BN = undefined
  ) {
    super(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime)
    if (typeof weight !== undefined) {
      this.weight = bintools.fromBNToBuffer(weight, 8)
    }
  }
}

/**
 * Class representing an unsigned AddDelegatorTx transaction.
 */
export class AddDelegatorTx extends WeightedValidatorTx {
  protected _typeName = "AddDelegatorTx"
  protected _typeID = PlatformVMConstants.ADDDELEGATORTX

  serialize(encoding: SerializedEncoding = "hex"): object {
    let fields: object = super.serialize(encoding)
    return {
      ...fields,
      stakeOuts: this.stakeOuts.map((s) => s.serialize(encoding)),
      rewardOwners: this.rewardOwners.serialize(encoding)
    }
  }
  deserialize(fields: object, encoding: SerializedEncoding = "hex") {
    super.deserialize(fields, encoding)
    this.stakeOuts = fields["stakeOuts"].map((s: object) => {
      let xferout: TransferableOutput = new TransferableOutput()
      xferout.deserialize(s, encoding)
      return xferout
    })
    this.rewardOwners = new ParseableOutput()
    this.rewardOwners.deserialize(fields["rewardOwners"], encoding)
  }

  protected stakeOuts: TransferableOutput[] = []
  protected rewardOwners: ParseableOutput = undefined

  /**
   * Returns the id of the [[AddDelegatorTx]]
   */
  getTxType(): number {
    return this._typeID
  }

  /**
   * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
   */
  getStakeAmount(): BN {
    return this.getWeight()
  }

  /**
   * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
   */
  getStakeAmountBuffer(): Buffer {
    return this.weight
  }

  /**
   * Returns the array of outputs being staked.
   */
  getStakeOuts(): TransferableOutput[] {
    return this.stakeOuts
  }

  /**
   * Should match stakeAmount. Used in sanity checking.
   */
  getStakeOutsTotal(): BN {
    let val: BN = new BN(0)
    for (let i: number = 0; i < this.stakeOuts.length; i++) {
      val = val.add(
        (this.stakeOuts[`${i}`].getOutput() as AmountOutput).getAmount()
      )
    }
    return val
  }

  /**
   * Returns a {@link https://github.com/feross/buffer|Buffer} for the reward address.
   */
  getRewardOwners(): ParseableOutput {
    return this.rewardOwners
  }

  getTotalOuts(): TransferableOutput[] {
    return [...(this.getOuts() as TransferableOutput[]), ...this.getStakeOuts()]
  }

  fromBuffer(bytes: Buffer, offset: number = 0): number {
    offset = super.fromBuffer(bytes, offset)
    const numstakeouts = bintools.copyFrom(bytes, offset, offset + 4)
    offset += 4
    const outcount: number = numstakeouts.readUInt32BE(0)
    this.stakeOuts = []
    for (let i: number = 0; i < outcount; i++) {
      const xferout: TransferableOutput = new TransferableOutput()
      offset = xferout.fromBuffer(bytes, offset)
      this.stakeOuts.push(xferout)
    }
    this.rewardOwners = new ParseableOutput()
    offset = this.rewardOwners.fromBuffer(bytes, offset)
    return offset
  }

  /**
   * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[AddDelegatorTx]].
   */
  toBuffer(): Buffer {
    const superbuff: Buffer = super.toBuffer()
    let bsize: number = superbuff.length
    const numouts: Buffer = Buffer.alloc(4)
    numouts.writeUInt32BE(this.stakeOuts.length, 0)
    let barr: Buffer[] = [super.toBuffer(), numouts]
    bsize += numouts.length
    this.stakeOuts = this.stakeOuts.sort(TransferableOutput.comparator())
    for (let i: number = 0; i < this.stakeOuts.length; i++) {
      let out: Buffer = this.stakeOuts[`${i}`].toBuffer()
      barr.push(out)
      bsize += out.length
    }
    let ro: Buffer = this.rewardOwners.toBuffer()
    barr.push(ro)
    bsize += ro.length
    return Buffer.concat(barr, bsize)
  }

  clone(): this {
    let newbase: AddDelegatorTx = new AddDelegatorTx()
    newbase.fromBuffer(this.toBuffer())
    return newbase as this
  }

  create(...args: any[]): this {
    return new AddDelegatorTx(...args) as this
  }

  /**
   * Class representing an unsigned AddDelegatorTx transaction.
   *
   * @param networkID Optional. Networkid, [[DefaultNetworkID]]
   * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
   * @param outs Optional. Array of the [[TransferableOutput]]s
   * @param ins Optional. Array of the [[TransferableInput]]s
   * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
   * @param nodeID Optional. The node ID of the validator being added.
   * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
   * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
   * @param stakeAmount Optional. The amount of nAVAX the validator is staking.
   * @param stakeOuts Optional. The outputs used in paying the stake.
   * @param rewardOwners Optional. The [[ParseableOutput]] containing a [[SECPOwnerOutput]] for the rewards.
   */
  constructor(
    networkID: number = DefaultNetworkID,
    blockchainID: Buffer = Buffer.alloc(32, 16),
    outs: TransferableOutput[] = undefined,
    ins: TransferableInput[] = undefined,
    memo: Buffer = undefined,
    nodeID: Buffer = undefined,
    startTime: BN = undefined,
    endTime: BN = undefined,
    stakeAmount: BN = undefined,
    stakeOuts: TransferableOutput[] = undefined,
    rewardOwners: ParseableOutput = undefined
  ) {
    super(
      networkID,
      blockchainID,
      outs,
      ins,
      memo,
      nodeID,
      startTime,
      endTime,
      stakeAmount
    )
    if (typeof stakeOuts !== undefined) {
      this.stakeOuts = stakeOuts
    }
    this.rewardOwners = rewardOwners
  }
}

export class AddValidatorTx extends AddDelegatorTx {
  protected _typeName = "AddValidatorTx"
  protected _typeID = PlatformVMConstants.ADDVALIDATORTX

  serialize(encoding: SerializedEncoding = "hex"): object {
    let fields: object = super.serialize(encoding)
    return {
      ...fields,
      delegationFee: serialization.encoder(
        this.getDelegationFeeBuffer(),
        encoding,
        "Buffer",
        "decimalString",
        4
      )
    }
  }
  deserialize(fields: object, encoding: SerializedEncoding = "hex") {
    super.deserialize(fields, encoding)
    let dbuff: Buffer = serialization.decoder(
      fields["delegationFee"],
      encoding,
      "decimalString",
      "Buffer",
      4
    )
    this.delegationFee =
      dbuff.readUInt32BE(0) / AddValidatorTx.delegatorMultiplier
  }

  protected delegationFee: number = 0
  private static delegatorMultiplier: number = 10000

  /**
   * Returns the id of the [[AddValidatorTx]]
   */
  getTxType(): number {
    return this._typeID
  }

  /**
   * Returns the delegation fee (represents a percentage from 0 to 100);
   */
  getDelegationFee(): number {
    return this.delegationFee
  }

  /**
   * Returns the binary representation of the delegation fee as a {@link https://github.com/feross/buffer|Buffer}.
   */
  getDelegationFeeBuffer(): Buffer {
    let dBuff: Buffer = Buffer.alloc(4)
    let buffnum: number =
      parseFloat(this.delegationFee.toFixed(4)) *
      AddValidatorTx.delegatorMultiplier
    dBuff.writeUInt32BE(buffnum, 0)
    return dBuff
  }

  fromBuffer(bytes: Buffer, offset: number = 0): number {
    offset = super.fromBuffer(bytes, offset)
    let dbuff: Buffer = bintools.copyFrom(bytes, offset, offset + 4)
    offset += 4
    this.delegationFee =
      dbuff.readUInt32BE(0) / AddValidatorTx.delegatorMultiplier
    return offset
  }

  toBuffer(): Buffer {
    let superBuff: Buffer = super.toBuffer()
    let feeBuff: Buffer = this.getDelegationFeeBuffer()
    return Buffer.concat([superBuff, feeBuff])
  }

  /**
   * Class representing an unsigned AddValidatorTx transaction.
   *
   * @param networkID Optional. Networkid, [[DefaultNetworkID]]
   * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
   * @param outs Optional. Array of the [[TransferableOutput]]s
   * @param ins Optional. Array of the [[TransferableInput]]s
   * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
   * @param nodeID Optional. The node ID of the validator being added.
   * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
   * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AVAX is returned).
   * @param stakeAmount Optional. The amount of nAVAX the validator is staking.
   * @param stakeOuts Optional. The outputs used in paying the stake.
   * @param rewardOwners Optional. The [[ParseableOutput]] containing the [[SECPOwnerOutput]] for the rewards.
   * @param delegationFee Optional. The percent fee this validator charges when others delegate stake to them.
   * Up to 4 decimal places allowed; additional decimal places are ignored. Must be between 0 and 100, inclusive.
   * For example, if delegationFeeRate is 1.2345 and someone delegates to this validator, then when the delegation
   * period is over, 1.2345% of the reward goes to the validator and the rest goes to the delegator.
   */
  constructor(
    networkID: number = DefaultNetworkID,
    blockchainID: Buffer = Buffer.alloc(32, 16),
    outs: TransferableOutput[] = undefined,
    ins: TransferableInput[] = undefined,
    memo: Buffer = undefined,
    nodeID: Buffer = undefined,
    startTime: BN = undefined,
    endTime: BN = undefined,
    stakeAmount: BN = undefined,
    stakeOuts: TransferableOutput[] = undefined,
    rewardOwners: ParseableOutput = undefined,
    delegationFee: number = undefined
  ) {
    super(
      networkID,
      blockchainID,
      outs,
      ins,
      memo,
      nodeID,
      startTime,
      endTime,
      stakeAmount,
      stakeOuts,
      rewardOwners
    )
    if (typeof delegationFee === "number") {
      if (delegationFee >= 0 && delegationFee <= 100) {
        this.delegationFee = parseFloat(delegationFee.toFixed(4))
      } else {
        throw new DelegationFeeError(
          "AddValidatorTx.constructor -- delegationFee must be in the range of 0 and 100, inclusively."
        )
      }
    }
  }
}

export class AddPermissionlessValidatorTx extends WeightedValidatorTx {
  protected _typeName = "AddPermissionlessValidatorTx"
  protected _typeID = PlatformVMConstants.ADDPERMISSIONLESSVALIDATORTX

  protected subnetID: Buffer = Buffer.alloc(32)
  protected signer: Signer = undefined
  protected stakeOuts: TransferableOutput[] = []
  protected validatorRewardsOwner: ParseableOutput = undefined
  protected delegatorRewardsOwner: ParseableOutput = undefined
  protected delegationShares: number = 0 // Fee from 0-100
  private static delegatorMultiplier: number = 10000

  getDelegationFee(): number {
    return this.delegationShares
  }

  getDelegationFeeBuffer(): Buffer {
    let dBuff: Buffer = Buffer.alloc(4)
    let buffnum: number = parseFloat(this.delegationShares.toFixed(4)) * AddPermissionlessValidatorTx.delegatorMultiplier
    dBuff.writeUInt32BE(buffnum, 0)
    return dBuff
  }

  getSubnetID(): Buffer {
    return this.subnetID
  }

  getSigner(): Signer {
    return this.signer
  }

  /**
   * Returns the array of outputs being staked.
   */
  getStakeOuts(): TransferableOutput[] {
    return this.stakeOuts
  }

  /**
   * Should match stakeAmount. Used in sanity checking.
   */
  getStakeOutsTotal(): BN {
    let val: BN = new BN(0)
    for (let i: number = 0; i < this.stakeOuts.length; i++) {
      val = val.add(
        (this.stakeOuts[`${i}`].getOutput() as AmountOutput).getAmount()
      )
    }
    return val
  }

  getValidatorRewardsOwner(): ParseableOutput {
    return this.validatorRewardsOwner
  }

  getDelegatorRewardsOwner(): ParseableOutput {
    return this.delegatorRewardsOwner
  }

  fromBuffer(bytes: Buffer, offset: number = 0): number {
    offset = super.fromBuffer(bytes, offset)
    this.subnetID = bintools.copyFrom(bytes, offset, offset + 32)
    offset += 32
    this.signer = new Signer()
    this.signer.fromBuffer(bintools.copyFrom(bytes, offset, offset + 148))
    offset += 148

    // Get stakeouts
    const numstakeouts = bintools.copyFrom(bytes, offset, offset + 4)
    offset += 4
    const outcount: number = numstakeouts.readUInt32BE(0)
    this.stakeOuts = []
    for (let i: number = 0; i < outcount; i++) {
      const xferout: TransferableOutput = new TransferableOutput()
      offset = xferout.fromBuffer(bytes, offset)
      this.stakeOuts.push(xferout)
    }

    this.validatorRewardsOwner = new ParseableOutput()
    offset = this.validatorRewardsOwner.fromBuffer(bytes, offset)
    this.delegatorRewardsOwner = new ParseableOutput()
    offset = this.delegatorRewardsOwner.fromBuffer(bytes, offset)

    let dbuff: Buffer = bintools.copyFrom(bytes, offset, offset + 4)
    offset += 4
    this.delegationShares = dbuff.readUInt32BE(0) / AddPermissionlessValidatorTx.delegatorMultiplier

    return offset
  }

  toBuffer(): Buffer {
    let superBuff: Buffer = super.toBuffer()
    let bsize: number = superBuff.length + this.subnetID.length
    let barr: Buffer[] = [superBuff, this.subnetID]

    let signerBuff: Buffer = this.signer.toBuffer()
    barr.push(signerBuff)
    bsize += signerBuff.length

    const numouts: Buffer = Buffer.alloc(4)
    numouts.writeUInt32BE(this.stakeOuts.length, 0)
    barr.push(numouts)
    bsize += numouts.length

    this.stakeOuts = this.stakeOuts.sort(TransferableOutput.comparator())
    for (let i: number = 0; i < this.stakeOuts.length; i++) {
      let out: Buffer = this.stakeOuts[`${i}`].toBuffer()
      barr.push(out)
      bsize += out.length
    }

    let vro: Buffer = this.validatorRewardsOwner.toBuffer()
    barr.push(vro)
    bsize += vro.length
    let dro: Buffer = this.delegatorRewardsOwner.toBuffer()
    barr.push(dro)
    bsize += dro.length
    let delegationSharesBuff: Buffer = this.getDelegationFeeBuffer()
    barr.push(delegationSharesBuff)
    bsize += delegationSharesBuff.length

    return Buffer.concat(barr, bsize)
  }

  constructor(
    networkID: number = DefaultNetworkID,
    blockchainID: Buffer = Buffer.alloc(32, 16),
    outs: TransferableOutput[] = undefined,
    ins: TransferableInput[] = undefined,
    memo: Buffer = undefined,
    nodeID: Buffer = undefined,
    startTime: BN = undefined,
    endTime: BN = undefined,
    weight: BN = undefined,
    subnetID: string | Buffer = undefined,
    signer: Signer,
    stakeOuts: TransferableOutput[] = undefined,
    validatorRewardsOwner: ParseableOutput = undefined,
    delegatorRewardsOwner: ParseableOutput = undefined,
    delegationShares: number = 0
  ) {
    super(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, weight)
    
    if (typeof subnetID != "undefined") {
      if (typeof subnetID === "string") {
        this.subnetID = bintools.cb58Decode(subnetID)
      } else {
        this.subnetID = subnetID
      }
    }

    this.signer = signer
    if (typeof stakeOuts !== undefined) {
      this.stakeOuts = stakeOuts
    }
    this.validatorRewardsOwner = validatorRewardsOwner
    this.delegatorRewardsOwner = delegatorRewardsOwner
    
    if (typeof delegationShares === "number") {
      if (delegationShares >= 0 && delegationShares <= 100) {
        this.delegationShares = parseFloat(delegationShares.toFixed(4))
      } else {
        throw new DelegationFeeError(
          "AddPermissionlessValidatorTx.constructor -- delegationFee must be in the range of 0 and 100, inclusively."
        )
      }
    }
  }
}

export class Signer {
  protected typeID: Buffer = Buffer.alloc(4)
  protected proofOfPossession: ProofOfPossession = undefined

  fromBuffer(bytes: Buffer, offset: number = 0): number {
    this.typeID = bintools.copyFrom(bytes, offset, offset + 4)
    offset += 4
    this.proofOfPossession = new ProofOfPossession()
    this.proofOfPossession.fromBuffer(bintools.copyFrom(bytes, offset, offset + 144), 0)
    offset += 144
    
    return offset
  }

  toBuffer(): Buffer {
    return Buffer.concat([this.typeID, this.proofOfPossession.toBuffer()])
  }

  getTypeID(): number {
    return this.typeID.readUInt32BE(0)
  }

  getProofOfPossession(): ProofOfPossession {
    return this.proofOfPossession
  }

  constructor(
    typeID: number,
    proofOfPossession: ProofOfPossession
  ) {
    this.typeID.writeUInt32BE(typeID, 0)
    this.proofOfPossession = proofOfPossession
  }
}

export class ProofOfPossession {
  protected publicKey: Buffer = Buffer.alloc(48)
  protected signature: Buffer = Buffer.alloc(96)

  fromBuffer(bytes: Buffer, offset: number = 0): number {
    this.publicKey = bintools.copyFrom(bytes, offset, offset + 48)
    offset += 48
    this.signature = bintools.copyFrom(bytes, offset, offset + 96)
    offset += 96
    
    return offset
  }

  toBuffer(): Buffer {
    return Buffer.concat([this.publicKey, this.signature])
  }

  getPublicKeyString(): string {
    return this.publicKey.toString('hex')
  }

  getSignature(): string {
    return this.signature.toString('hex')
  }

  constructor(
    publicKey: Buffer,
    signature: Buffer,
  ) {
    this.publicKey = publicKey
    this.signature = signature
  }
}