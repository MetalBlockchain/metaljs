import BN from "bn.js"
import { Buffer } from "buffer/"
import {
  AddPermissionlessValidatorTx,
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

describe("AddPermissionlessValidatorTx", (): void => {
  const bintools: BinTools = BinTools.getInstance()
  const addPermissionlessValidatorTxHex: string = "0000000100000000000000000000000000000000000000000000000000000000000000000000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000070000006671f693250000000000000000000000010000000121580ecc607daaea2a8a4ab1e94f4692441d24a600000001237d108b086587cd7aa27b0c52a52282b45b5057a8b835cf249e45f81a359b280000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000005000002381b40b325000000010000000000000000207aafeec2cff401b443cb33fffaf9e769c0228f0000000065eaf2770000000065fd67b3000001d1a94a200000000000000000000000000000000000000000000000000000000000000000000000001c98fa1d2734676a6a396920424920dd1bc56b01666431ce2ddfa78839bf41979236146e9f29d8b9508442edd6a8015ed596be129c20af00923baa6fa4f0859cf5e479cd287cf4be078bbcf3c5cd39f9ffefabb83ac4a1ea6ca20c705afe3ce02a10d0bb5fc85b04846914ad41bfdfe49bbf9b252901c55ce2b8ccae81279c81e0d1e905ea7b859a941e3e36cc6c58272f0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000001d1a94a20000000000000000000000000010000000121580ecc607daaea2a8a4ab1e94f4692441d24a60000000b0000000000000000000000010000000121580ecc607daaea2a8a4ab1e94f4692441d24a60000000b0000000000000000000000010000000121580ecc607daaea2a8a4ab1e94f4692441d24a600004e20"
  const addPermissionlessValidatorTxBuf: Buffer = Buffer.from(
    addPermissionlessValidatorTxHex,
    "hex"
  )
  const addPermissionlessValidatorTx: AddPermissionlessValidatorTx = new AddPermissionlessValidatorTx()
  addPermissionlessValidatorTx.fromBuffer(addPermissionlessValidatorTxBuf)

  test("getTypeName", async (): Promise<void> => {
    const addPermissionlessValidatorTxTypeName: string = addPermissionlessValidatorTx.getTypeName()
    expect(addPermissionlessValidatorTxTypeName).toBe("AddPermissionlessValidatorTx")
  })

  test("getTypeID", async (): Promise<void> => {
    const typeID: number = addPermissionlessValidatorTx.getTypeID()
    expect(typeID).toBe(25)
  })

  test("getNetworkID", async (): Promise<void> => {
    const typeID: number = addPermissionlessValidatorTx.getNetworkID()
    expect(typeID).toBe(1)
  })

  test("getNodeIDString", async (): Promise<void> => {
    const typeID: string = addPermissionlessValidatorTx.getNodeIDString()
    expect(typeID).toBe("NodeID-3xjbbe7qeVWY3FyTExBTif2apD5mAXjUn")
  })

  test("getBlockchainID", async (): Promise<void> => {
    const value: Buffer = addPermissionlessValidatorTx.getBlockchainID()
    expect(bintools.cb58Encode(value)).toBe("11111111111111111111111111111111LpoYY")
  })

  test("getOuts", async (): Promise<void> => {
    const value: TransferableOutput[] = addPermissionlessValidatorTx.getOuts()
    expect(bintools.cb58Encode(value[0].getAssetID())).toBe("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z")
    expect(value[0].getOutput().getTypeName()).toBe("SECPTransferOutput")
    expect(value[0].getOutput().getLocktime().toString(10)).toBe("0")
    expect(bintools.addressToString("metal", "P", value[0].getOutput().getAddress(0))).toBe("P-metal1y9vqanrq0k4w5252f2c7jn6xjfzp6f9x5dng8f")
    expect(value[0].getOutput().getThreshold()).toBe(1)
    const output: SECPTransferOutput = value[0].getOutput()
    expect(output.getAmount().toString(10)).toBe("439998649125")
  })

  test("getIns", async (): Promise<void> => {
    const value: TransferableInput[] = addPermissionlessValidatorTx.getIns()
    expect(bintools.cb58Encode(value[0].getAssetID())).toBe("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z")
    expect(bintools.cb58Encode(value[0].getTxID())).toBe("GdWQRQ65Xv5mFVzUU2ADTo7hVEeHx1h685s5u5c6utVHJdepp")
    expect(value[0].getOutputIdx().readUInt32BE(0)).toBe(0)
    expect(value[0].getInput().getTypeName()).toBe("SECPTransferInput")
  })

  test("getMemo", async (): Promise<void> => {
    const value: Buffer = addPermissionlessValidatorTx.getMemo()
    expect(value.toString()).toBe("")
  })

  test("getStartTime", async (): Promise<void> => {
    const value: BN = addPermissionlessValidatorTx.getStartTime()
    expect(value.toString(10)).toBe("1709896311")
  })

  test("getEndTime", async (): Promise<void> => {
    const value: BN = addPermissionlessValidatorTx.getEndTime()
    expect(value.toString(10)).toBe("1711105971")
  })

  test("getWeight", async (): Promise<void> => {
    const value: BN = addPermissionlessValidatorTx.getWeight()
    expect(value.toString(10)).toBe("2000000000000")
  })

  test("getSubnetID", async (): Promise<void> => {
    const value: Buffer = addPermissionlessValidatorTx.getSubnetID()
    expect(bintools.cb58Encode(value)).toBe("11111111111111111111111111111111LpoYY")
  })

  test("getSigner", async (): Promise<void> => {
    const signer: Signer = addPermissionlessValidatorTx.getSigner()
    expect(signer.getTypeID()).toBe(28)
    expect(signer.getProofOfPossession().getPublicKeyString()).toBe("98fa1d2734676a6a396920424920dd1bc56b01666431ce2ddfa78839bf41979236146e9f29d8b9508442edd6a8015ed5")
    expect(signer.getProofOfPossession().getSignature()).toBe("96be129c20af00923baa6fa4f0859cf5e479cd287cf4be078bbcf3c5cd39f9ffefabb83ac4a1ea6ca20c705afe3ce02a10d0bb5fc85b04846914ad41bfdfe49bbf9b252901c55ce2b8ccae81279c81e0d1e905ea7b859a941e3e36cc6c58272f")
  })

  test("getStakeOutsTotal", async (): Promise<void> => {
    const value: BN = addPermissionlessValidatorTx.getStakeOutsTotal()
    expect(value.toString(10)).toBe("2000000000000")
  })

  test("getStakeOuts", async (): Promise<void> => {
    const value: TransferableOutput[] = addPermissionlessValidatorTx.getStakeOuts()
    expect(value.length).toBe(1)
    expect(value[0].getOutput().getTypeName()).toBe("SECPTransferOutput")
    expect(value[0].getOutput().getLocktime().toString(10)).toBe("0")
  })

  test("getValidatorRewardsOwner", async (): Promise<void> => {
    const value: ParseableOutput = addPermissionlessValidatorTx.getValidatorRewardsOwner()
    expect(value.getOutput().getLocktime().toString(10)).toBe("0")
    expect(bintools.addressToString("metal", "P", value.getOutput().getAddress(0))).toBe("P-metal1y9vqanrq0k4w5252f2c7jn6xjfzp6f9x5dng8f")
    expect(value.getOutput().getTypeName()).toBe("SECPOwnerOutput")
  })

  test("getDelegatorRewardsOwner", async (): Promise<void> => {
    const value: ParseableOutput = addPermissionlessValidatorTx.getDelegatorRewardsOwner()
    expect(value.getOutput().getLocktime().toString(10)).toBe("0")
    expect(bintools.addressToString("metal", "P", value.getOutput().getAddress(0))).toBe("P-metal1y9vqanrq0k4w5252f2c7jn6xjfzp6f9x5dng8f")
  })

  test("getDelegationFee", async (): Promise<void> => {
    const value: number = addPermissionlessValidatorTx.getDelegationFee()
    expect(value).toBe(2)
  })

  test("toBuffer", async (): Promise<void> => {
    const value: Buffer = addPermissionlessValidatorTx.toBuffer()
    expect(value.toString("hex")).toBe(addPermissionlessValidatorTxHex)
  })

  test("constructor", async (): Promise<void> => {
    let input: AmountInput = new SECPTransferInput(new BN("2439998649125"))
    input.addSignatureIdx(0, bintools.stringToAddress("P-metal1y9vqanrq0k4w5252f2c7jn6xjfzp6f9x5dng8f", "metal"))

    const tx: AddPermissionlessValidatorTx = new AddPermissionlessValidatorTx(
      1,
      bintools.cb58Decode("11111111111111111111111111111111LpoYY"),
      [
        new TransferableOutput(
          bintools.cb58Decode("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"),
          new SECPTransferOutput(
            new BN("439998649125"),
            [
              bintools.stringToAddress("P-metal1y9vqanrq0k4w5252f2c7jn6xjfzp6f9x5dng8f", "metal")
            ],
            new BN(0),
            1
          )
        )
      ],
      [
        new TransferableInput(
          bintools.cb58Decode("GdWQRQ65Xv5mFVzUU2ADTo7hVEeHx1h685s5u5c6utVHJdepp"),
          Buffer.from("00000000", "hex"),
          bintools.cb58Decode("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"),
          input
        )
      ],
      undefined,
      NodeIDStringToBuffer("NodeID-3xjbbe7qeVWY3FyTExBTif2apD5mAXjUn"),
      new BN("1709896311"),
      new BN("1711105971"),
      new BN("2000000000000"),
      bintools.cb58Decode("11111111111111111111111111111111LpoYY"),
      new Signer(
        PlatformVMConstants.SIGNERPRIMARYNETWORK,
        new ProofOfPossession(
          Buffer.from("98fa1d2734676a6a396920424920dd1bc56b01666431ce2ddfa78839bf41979236146e9f29d8b9508442edd6a8015ed5", "hex"),
          Buffer.from("96be129c20af00923baa6fa4f0859cf5e479cd287cf4be078bbcf3c5cd39f9ffefabb83ac4a1ea6ca20c705afe3ce02a10d0bb5fc85b04846914ad41bfdfe49bbf9b252901c55ce2b8ccae81279c81e0d1e905ea7b859a941e3e36cc6c58272f", "hex")
        )
      ),
      // Stake outs
      [
        new TransferableOutput(
          bintools.cb58Decode("FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"),
          new SECPTransferOutput(
            new BN("2000000000000"),
            [
              bintools.stringToAddress("P-metal1y9vqanrq0k4w5252f2c7jn6xjfzp6f9x5dng8f", "metal")
            ],
            new BN(0),
            1
          )
        )
      ],
      // Validation owners
      new ParseableOutput(
        new SECPOwnerOutput(
          [bintools.stringToAddress("P-metal1y9vqanrq0k4w5252f2c7jn6xjfzp6f9x5dng8f", "metal")],
          new BN(0),
          1
        )
      ),
      // Delegation owners
      new ParseableOutput(
        new SECPOwnerOutput(
          [bintools.stringToAddress("P-metal1y9vqanrq0k4w5252f2c7jn6xjfzp6f9x5dng8f", "metal")],
          new BN(0),
          1
        )
      ),
      2
    )
    expect(tx.toBuffer().toString('hex')).toBe(addPermissionlessValidatorTxHex)
  })
})
