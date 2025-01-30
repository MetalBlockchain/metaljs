import BN from "bn.js"
import { Buffer } from "buffer/"
import {
  AddPermissionlessDelegatorTx,
  AmountInput,
  ParseableInput,
  ParseableOutput,
  PlatformVMConstants,
  ProofOfPossession,
  SECPOwnerOutput,
  SECPTransferInput,
  SECPTransferOutput,
  Signer,
  StakeableLockIn,
  TransferableInput,
  TransferableOutput,
} from "src/apis/platformvm"
import { NodeIDStringToBuffer, bufferToNodeIDString } from "src/utils"
import BinTools from "../../../src/utils/bintools"

describe("AddPermissionlessDelegatorTx", (): void => {
  const bintools: BinTools = BinTools.getInstance()
  const addPermissionlessDelegatorTxHex: string = "0000000100000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000692c760d40000000000000000000000001000000015cf998275803a7277926912defdf177b2e97b0b400000001016ce71294d61b4d3fbf3f2e0bef71053842b3317ad10cc13fb0a8eb4092240b0000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000007307a0fe600000000100000000000000007a8bf177115b8b565bfac10d24127307a14acc350000000065fc12dd0000000066113b1100000009db2af12000000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000700000009db2af120000000000000000000000001000000015cf998275803a7277926912defdf177b2e97b0b40000000b000000000000000000000001000000012892441ba9a160bcdc596dcd2cc3ad83c3493589"
  const addPermissionlessDelegatorTxBuf: Buffer = Buffer.from(
    addPermissionlessDelegatorTxHex,
    "hex"
  )
  const addPermissionlessDelegatorTx: AddPermissionlessDelegatorTx = new AddPermissionlessDelegatorTx()
  addPermissionlessDelegatorTx.fromBuffer(addPermissionlessDelegatorTxBuf)

  test("getTypeName", async (): Promise<void> => {
    const addPermissionlessDelegatorTxTypeName: string = addPermissionlessDelegatorTx.getTypeName()
    expect(addPermissionlessDelegatorTxTypeName).toBe("AddPermissionlessDelegatorTx")
  })

  test("getTypeID", async (): Promise<void> => {
    const typeID: number = addPermissionlessDelegatorTx.getTypeID()
    expect(typeID).toBe(26)
  })

  test("getNetworkID", async (): Promise<void> => {
    const typeID: number = addPermissionlessDelegatorTx.getNetworkID()
    expect(typeID).toBe(1)
  })

  test("getNodeIDString", async (): Promise<void> => {
    const typeID: string = addPermissionlessDelegatorTx.getNodeIDString()
    expect(typeID).toBe("NodeID-CAy5q5U4AnPR35i225a2QXM7ftYvbZEEg")
  })

  test("getBlockchainID", async (): Promise<void> => {
    const value: Buffer = addPermissionlessDelegatorTx.getBlockchainID()
    expect(bintools.cb58Encode(value)).toBe("11111111111111111111111111111111LpoYY")
  })

  test("getOuts", async (): Promise<void> => {
    const value: TransferableOutput[] = addPermissionlessDelegatorTx.getOuts()
    expect(bintools.cb58Encode(value[0].getAssetID())).toBe("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z")
    expect(value[0].getOutput().getTypeName()).toBe("SECPTransferOutput")
    expect(value[0].getOutput().getLocktime().toString(10)).toBe("0")
    expect(bintools.addressToString("metal", "P", value[0].getOutput().getAddress(0))).toBe("P-metal1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95t3vxnp")
    expect(value[0].getOutput().getThreshold()).toBe(1)
    const output: SECPTransferOutput = value[0].getOutput() as SECPTransferOutput
    expect(output.getAmount().toString(10)).toBe("451717500224")
  })

  test("getIns", async (): Promise<void> => {
    const value: TransferableInput[] = addPermissionlessDelegatorTx.getIns()
    expect(bintools.cb58Encode(value[0].getAssetID())).toBe("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z")
    expect(bintools.cb58Encode(value[0].getTxID())).toBe("dQn5fqDWuByJB1dqFihhuapiF2UzyrnBft5RcBbiYGWoRWcR")
    expect(value[0].getOutputIdx().readUInt32BE(0)).toBe(0)
    expect(value[0].getInput().getTypeName()).toBe("SECPTransferInput")
  })

  test("getMemo", async (): Promise<void> => {
    const value: Buffer = addPermissionlessDelegatorTx.getMemo()
    expect(value.toString()).toBe("")
  })

  test("getStartTime", async (): Promise<void> => {
    const value: BN = addPermissionlessDelegatorTx.getStartTime()
    expect(value.toString(10)).toBe("1711018717")
  })

  test("getEndTime", async (): Promise<void> => {
    const value: BN = addPermissionlessDelegatorTx.getEndTime()
    expect(value.toString(10)).toBe("1712405265")
  })

  test("getWeight", async (): Promise<void> => {
    const value: BN = addPermissionlessDelegatorTx.getWeight()
    expect(value.toString(10)).toBe("42331730208")
  })

  test("getSubnetID", async (): Promise<void> => {
    const value: Buffer = addPermissionlessDelegatorTx.getSubnetID()
    expect(bintools.cb58Encode(value)).toBe("11111111111111111111111111111111LpoYY")
  })

  test("getStakeOutsTotal", async (): Promise<void> => {
    const value: BN = addPermissionlessDelegatorTx.getStakeOutsTotal()
    expect(value.toString(10)).toBe("42331730208")
  })

  test("getStakeOuts", async (): Promise<void> => {
    const value: TransferableOutput[] = addPermissionlessDelegatorTx.getStakeOuts()
    expect(value.length).toBe(1)
    expect(value[0].getOutput().getTypeName()).toBe("SECPTransferOutput")
    expect(value[0].getOutput().getLocktime().toString(10)).toBe("0")
  })

  test("getDelegatorRewardsOwner", async (): Promise<void> => {
    const value: ParseableOutput = addPermissionlessDelegatorTx.getRewardOwners()
    expect(value.getOutput().getLocktime().toString(10)).toBe("0")
    expect(bintools.addressToString("metal", "P", value.getOutput().getAddress(0))).toBe("P-metal19zfygxaf59stehzedhxjesads0p5jdvfu64fq2")
  })

  test("getStakeAmount", async (): Promise<void> => {
    const value: BN = addPermissionlessDelegatorTx.getStakeAmount()
    expect(value.toString(10)).toBe("42331730208")
  })

  test("toBuffer", async (): Promise<void> => {
    const value: Buffer = addPermissionlessDelegatorTx.toBuffer()
    expect(value.toString("hex")).toBe(addPermissionlessDelegatorTxHex)
  })

  test("constructor", async (): Promise<void> => {
    let input: AmountInput = new SECPTransferInput(new BN("494049230432"))
    input.addSignatureIdx(0, bintools.stringToAddress("P-metal1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95t3vxnp", "metal"))

    const tx: AddPermissionlessDelegatorTx = new AddPermissionlessDelegatorTx(
      1,
      bintools.cb58Decode("11111111111111111111111111111111LpoYY"),
      [
        new TransferableOutput(
          bintools.cb58Decode("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"),
          new SECPTransferOutput(
            new BN("451717500224"),
            [
              bintools.stringToAddress("P-metal1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95t3vxnp", "metal")
            ],
            new BN(0),
            1
          )
        )
      ],
      [
        new TransferableInput(
          bintools.cb58Decode("dQn5fqDWuByJB1dqFihhuapiF2UzyrnBft5RcBbiYGWoRWcR"),
          Buffer.from("00000000", "hex"),
          bintools.cb58Decode("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"),
          input
        )
      ],
      undefined,
      NodeIDStringToBuffer("NodeID-CAy5q5U4AnPR35i225a2QXM7ftYvbZEEg"),
      new BN("1711018717"),
      new BN("1712405265"),
      new BN("42331730208"),
      // Stake outs
      [
        new TransferableOutput(
          bintools.cb58Decode("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"),
          new SECPTransferOutput(
            new BN("42331730208"),
            [
              bintools.stringToAddress("P-metal1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95t3vxnp", "metal")
            ],
            new BN(0),
            1
          )
        )
      ],
      // Delegation owners
      new ParseableOutput(
        new SECPOwnerOutput(
          [bintools.stringToAddress("P-metal19zfygxaf59stehzedhxjesads0p5jdvfu64fq2", "metal")],
          new BN(0),
          1
        )
      ),
      bintools.cb58Decode("11111111111111111111111111111111LpoYY")
    )
    expect(tx.toBuffer().toString('hex')).toBe(addPermissionlessDelegatorTxHex)
  })
})
