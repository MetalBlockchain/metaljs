import BN from "bn.js"
import { Buffer } from "buffer/"
import {
  AddPermissionlessDelegatorTx,
  AmountInput,
  ImportTx,
  ParseableInput,
  ParseableOutput,
  PlatformVMAPI,
  PlatformVMConstants,
  ProofOfPossession,
  SECPOwnerOutput,
  SECPTransferInput,
  SECPTransferOutput,
  Signer,
  StakeableLockIn,
  TransferableInput,
  TransferableOutput,
  UnsignedTx,
  UTXO,
} from "src/apis/platformvm"
import { DefaultNetworkID, NodeIDStringToBuffer, UTF8Payload, bufferToNodeIDString } from "src/utils"
import BinTools from "../../../src/utils/bintools"
import Metal from "src"
import { getTransactionComplexity } from "src/apis/platformvm/dynamicfee/complexity"
import { createDimensions, Dimensions, FeeDimensions } from "src/apis/platformvm/dynamicfee/dimensions"
import { INTRINSIC_ADD_PERMISSIONLESS_DELEGATOR_TX_COMPLEXITIES, INTRINSIC_ADD_PERMISSIONLESS_VALIDATOR_TX_COMPLEXITIES, INTRINSIC_BLS_POP_VERIFY_COMPUTE, INTRINSIC_BLS_VERIFY_COMPUTE, INTRINSIC_EXPORT_TX_COMPLEXITIES, INTRINSIC_IMPORT_TX_COMPLEXITIES, INTRINSIC_INPUT_DB_READ, INTRINSIC_INPUT_DB_WRITE, INTRINSIC_OUTPUT_DB_WRITE, INTRINSIC_SECP256K1_FX_SIGNATURE_COMPUTE } from "src/apis/platformvm/dynamicfee/constants"
import { calculateFee } from "src/apis/platformvm/dynamicfee/calculator"

const testUTXOID1 = Buffer.from('0x009e71412d5b89d0b51e679a93cf59966c3c89346949f1976f930feddbfd765d', 'hex');
const testUTXOID2 = Buffer.from('0xd1f6526c4233a5af42b0c8311a9824a84f73b3e32ba637aaa7d9dd4994bccbad', 'hex');
const testUTXOID3 = Buffer.from('0x5199944d5f58272adff87558c5c0857d3de3be01da518431523bff2bbf1117e6', 'hex');
const xAddressForTest = 'X-fuji1w5jg0xyw2zq22nhpjar834gyeksc6wuleftqzg';
const bintools: BinTools = BinTools.getInstance()
const metalAssetId: Buffer = bintools.cb58Decode("2pjq58dnYTfrUJvvnC1uHDBP87DyP2oJj9uTmt3vdJg9Nhr9d4");
const cChainId: Buffer = bintools.cb58Decode("28fJD1hMz2PSRJKJt7YT41urTPR37rUNUcdeJ8daoiwP6DGnAR");

const getLockedUTXO = (
    amt = new BN(30).mul(new BN(1e9)),
    lockTime = new BN(Math.floor(new Date().getTime() / 1000)).add(new BN(100000))
) => {
    return new UTXO(
        0,
        testUTXOID1,
        0,
        metalAssetId,
        new SECPTransferOutput(
            amt,
            [bintools.stringToAddress(xAddressForTest, 'fuji')],
            lockTime
        )
    )
}

const getValidUtxo = (
    amt = new BN(50).mul(new BN(1e9)),
    assetId = metalAssetId
) => {
    return new UTXO(
        0,
        testUTXOID3,
        0,
        assetId,
        new SECPTransferOutput(
            amt,
            [bintools.stringToAddress(xAddressForTest, 'fuji')]
        )
    )
}

const txTests = [
    {
        name: "AddPermissionlessValidatorTx for primary network",
        tx: "00000000001900003039000000000000000000000000000000000000000000000000000000000000000000000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db0000000700238520ba8b1e00000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001043c91e9d508169329034e2a68110427a311f945efc53ed3f3493d335b393fd100000000dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000005002386f263d53e00000000010000000000000000c582872c37c81efa2c94ea347af49cdc23a830aa00000000669ae35f0000000066b692df000001d1a94a200000000000000000000000000000000000000000000000000000000000000000000000001ca3783a891cb41cadbfcf456da149f30e7af972677a162b984bef0779f254baac51ec042df1781d1295df80fb41c801269731fc6c25e1e5940dc3cb8509e30348fa712742cfdc83678acc9f95908eb98b89b28802fb559b4a2a6ff3216707c07f0ceb0b45a95f4f9a9540bbd3331d8ab4f233bffa4abb97fad9d59a1695f31b92a2b89e365facf7ab8c30de7c4a496d1e00000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000007000001d1a94a2000000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000b000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000b000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0007a12000000001000000090000000135f122f90bcece0d6c43e07fed1829578a23bc1734f8a4b46203f9f192ea1aec7526f3dca8fddec7418988615e6543012452bae1544275aae435313ec006ec9000",
        expectedComplexity: createDimensions({
            bandwidth: 691,
            dbRead: INTRINSIC_ADD_PERMISSIONLESS_VALIDATOR_TX_COMPLEXITIES[FeeDimensions.DBRead] + INTRINSIC_INPUT_DB_READ,
            dbWrite: INTRINSIC_ADD_PERMISSIONLESS_VALIDATOR_TX_COMPLEXITIES[FeeDimensions.DBWrite] + INTRINSIC_INPUT_DB_WRITE + (2 * INTRINSIC_OUTPUT_DB_WRITE),
            compute: INTRINSIC_BLS_POP_VERIFY_COMPUTE + INTRINSIC_SECP256K1_FX_SIGNATURE_COMPUTE
        }),
        expectedDynamicFee: 137_191n
    },
    {
        name: "AddPermissionlessDelegatorTx for primary network",
        tx: "00000000001a00003039000000000000000000000000000000000000000000000000000000000000000000000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db000000070023834f1140fe00000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c000000017d199179744b3b82d0071c83c2fb7dd6b95a2cdbe9dde295e0ae4f8c2287370300000000dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db0000000500238520ba8b1e00000000010000000000000000c582872c37c81efa2c94ea347af49cdc23a830aa00000000669ae6080000000066ad5b08000001d1a94a2000000000000000000000000000000000000000000000000000000000000000000000000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000007000001d1a94a2000000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000b000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000100000009000000012261556f74a29f02ffc2725a567db2c81f75d0892525dbebaa1cf8650534cc70061123533a9553184cb02d899943ff0bf0b39c77b173c133854bc7c8bc7ab9a400",
        expectedComplexity: createDimensions({
            bandwidth: 499,
            dbRead: INTRINSIC_ADD_PERMISSIONLESS_DELEGATOR_TX_COMPLEXITIES[FeeDimensions.DBRead] + INTRINSIC_INPUT_DB_READ,
            dbWrite: INTRINSIC_ADD_PERMISSIONLESS_DELEGATOR_TX_COMPLEXITIES[FeeDimensions.DBWrite] + INTRINSIC_INPUT_DB_WRITE + (2 * INTRINSIC_OUTPUT_DB_WRITE),
            compute: INTRINSIC_SECP256K1_FX_SIGNATURE_COMPUTE
        }),
        expectedDynamicFee: 106_499n
    },
    {
        name: "ExportTx",
        tx: "00000000001200003039000000000000000000000000000000000000000000000000000000000000000000000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db000000070023834e99dda340000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c00000001f62c03574790b6a31a988f90c3e91c50fdd6f5d93baf200057463021ff23ec5c00000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db000000050023834ed587af800000000100000000000000009d0775f450604bd2fbc49ce0c5c1c6dfeb2dc2acb8c92c26eeae6e6df4502b1900000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000007000000003b9aca00000000000000000100000002000000024a177205df5c29929d06db9d941f83d5ea985de3e902a9a86640bfdb1cd0e36c0cc982b83e5765fa000000010000000900000001129a07c92045e0b9d0a203fcb5b53db7890fabce1397ff6a2ad16c98ef0151891ae72949d240122abf37b1206b95e05ff171df164a98e6bdf2384432eac2c30200",
        expectedComplexity: createDimensions({
            bandwidth: 435,
            dbRead: INTRINSIC_EXPORT_TX_COMPLEXITIES[FeeDimensions.DBRead] + INTRINSIC_INPUT_DB_READ,
            dbWrite: INTRINSIC_EXPORT_TX_COMPLEXITIES[FeeDimensions.DBWrite] + INTRINSIC_INPUT_DB_WRITE + (2 * INTRINSIC_OUTPUT_DB_WRITE),
            compute: INTRINSIC_SECP256K1_FX_SIGNATURE_COMPUTE
        }),
        expectedDynamicFee: 64_435n
    },
    {
        name: "ImportTx",
        tx: "00000000001100003039000000000000000000000000000000000000000000000000000000000000000000000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000007000000003b8b87c0000000000000000100000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000000000000d891ad56056d9c01f18f43f58b5c784ad07a4a49cf3d1f11623804b5cba2c6bf0000000163684415710a7d65f4ccb095edff59f897106b94d38937fc60e3ffc29892833b00000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000005000000003b9aca00000000010000000000000001000000090000000148ea12cb0950e47d852b99765208f5a811d3c8a47fa7b23fd524bd970019d157029f973abb91c31a146752ef8178434deb331db24c8dca5e61c961e6ac2f3b6700",
        expectedComplexity: createDimensions({
            bandwidth: 335,
            dbRead: INTRINSIC_IMPORT_TX_COMPLEXITIES[FeeDimensions.DBRead] + INTRINSIC_INPUT_DB_READ,
            dbWrite: INTRINSIC_IMPORT_TX_COMPLEXITIES[FeeDimensions.DBWrite] + INTRINSIC_INPUT_DB_WRITE + INTRINSIC_OUTPUT_DB_WRITE,
            compute: INTRINSIC_SECP256K1_FX_SIGNATURE_COMPUTE
        }),
        expectedDynamicFee: 44_335n
    },
]

const TEST_DYNAMIC_WEIGHTS: Dimensions = createDimensions({
    bandwidth: 1,
    dbRead: 2_000,
    dbWrite: 20_000,
    compute: 10,
});
const TEST_DYNAMIC_PRICE = 1n;

describe("Dynamic Fees", (): void => {
  test("complexity", async (): Promise<void> => {
    const VALID_AMOUNT = BigInt(50 * 1e9);

    for (let tx of txTests) {
        const unsigned: UnsignedTx = new UnsignedTx();
        unsigned.fromBuffer(Buffer.from(tx.tx, 'hex'));
        const complexity: Dimensions = getTransactionComplexity(unsigned);
        
        expect(complexity[FeeDimensions.Bandwidth]).toBe(tx.expectedComplexity[FeeDimensions.Bandwidth])
        expect(complexity[FeeDimensions.DBRead]).toBe(tx.expectedComplexity[FeeDimensions.DBRead])
        expect(complexity[FeeDimensions.DBWrite]).toBe(tx.expectedComplexity[FeeDimensions.DBWrite])
        expect(complexity[FeeDimensions.Compute]).toBe(tx.expectedComplexity[FeeDimensions.Compute])

        const fee = calculateFee(unsigned, TEST_DYNAMIC_WEIGHTS, TEST_DYNAMIC_PRICE);
        expect(fee).toBe(tx.expectedDynamicFee)
    }
  })
})
