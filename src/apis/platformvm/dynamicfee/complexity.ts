import { OutputOwners } from "src/common";
import { BaseTx } from "../basetx";
import { ExportTx } from "../exporttx";
import { ImportTx } from "../importtx";
import { StakeableLockIn, TransferableInput } from "../inputs";
import { ParseableOutput, SECPTransferOutput, StakeableLockOut, TransferableOutput } from "../outputs";
import { UnsignedTx } from "../tx";
import { AddPermissionlessDelegatorTx, AddPermissionlessValidatorTx, Signer } from "../validationtx";
import { INTRINSIC_ADD_PERMISSIONLESS_DELEGATOR_TX_COMPLEXITIES, INTRINSIC_ADD_PERMISSIONLESS_VALIDATOR_TX_COMPLEXITIES, INTRINSIC_BASE_TX_COMPLEXITIES, INTRINSIC_BLS_POP_VERIFY_COMPUTE, INTRINSIC_EXPORT_TX_COMPLEXITIES, INTRINSIC_IMPORT_TX_COMPLEXITIES, INTRINSIC_INPUT_BANDWIDTH, INTRINSIC_INPUT_DB_READ, INTRINSIC_INPUT_DB_WRITE, INTRINSIC_OUTPUT_BANDWIDTH, INTRINSIC_OUTPUT_DB_WRITE, INTRINSIC_POP_BANDWIDTH, INTRINSIC_SECP256K1_FX_OUTPUT_BANDWIDTH, INTRINSIC_SECP256K1_FX_OUTPUT_OWNERS_BANDWIDTH, INTRINSIC_SECP256K1_FX_SIGNATURE_BANDWIDTH, INTRINSIC_SECP256K1_FX_SIGNATURE_COMPUTE, INTRINSIC_SECP256K1_FX_TRANSFERABLE_INPUT_BANDWIDTH, INTRINSIC_STAKEABLE_LOCKED_INPUT_BANDWIDTH, INTRINSIC_STAKEABLE_LOCKED_OUTPUT_BANDWIDTH, SHORT_ID_LEN } from "./constants";
import { addDimensions, createDimensions, createEmptyDimensions, Dimensions, FeeDimensions } from "./dimensions";

export const getBytesComplexity = (...bytes: (Uint8Array)[]): Dimensions => {
    const result = createEmptyDimensions();
    bytes.forEach((b) => {
      result[FeeDimensions.Bandwidth] += b.length;
    });
    return result;
};

export const getOutputComplexity = (
    transferableOutputs: readonly TransferableOutput[],
): Dimensions => {
    let complexity = createEmptyDimensions();

    for (const transferableOutput of transferableOutputs) {
        const outComplexity: Dimensions = {
            [FeeDimensions.Bandwidth]: INTRINSIC_OUTPUT_BANDWIDTH + INTRINSIC_SECP256K1_FX_OUTPUT_BANDWIDTH,
            [FeeDimensions.DBRead]: 0,
            [FeeDimensions.DBWrite]: INTRINSIC_OUTPUT_DB_WRITE,
            [FeeDimensions.Compute]: 0,
        };

        let numberOfAddresses = 0;

        if (transferableOutput.getOutput() instanceof StakeableLockOut) {
            outComplexity[FeeDimensions.Bandwidth] += INTRINSIC_STAKEABLE_LOCKED_OUTPUT_BANDWIDTH;
            numberOfAddresses = (transferableOutput.getOutput() as StakeableLockOut).getAddresses().length;
        } else if (transferableOutput.getOutput() instanceof SECPTransferOutput) {
            numberOfAddresses = (transferableOutput.getOutput() as SECPTransferOutput).getAddresses().length;
        }

        const addressBandwidth = numberOfAddresses * SHORT_ID_LEN;

        outComplexity[FeeDimensions.Bandwidth] += addressBandwidth;

        complexity = addDimensions(complexity, outComplexity);
    }

    return complexity;
}

export const getInputComplexity = (
    transferableInputs: readonly TransferableInput[],
  ): Dimensions => {
    let complexity = createEmptyDimensions();
  
    for (const transferableInput of transferableInputs) {
      const inputComplexity: Dimensions = {
        [FeeDimensions.Bandwidth]: INTRINSIC_INPUT_BANDWIDTH + INTRINSIC_SECP256K1_FX_TRANSFERABLE_INPUT_BANDWIDTH,
        [FeeDimensions.DBRead]: INTRINSIC_INPUT_DB_READ,
        [FeeDimensions.DBWrite]: INTRINSIC_INPUT_DB_WRITE,
        [FeeDimensions.Compute]: 0,
      };
  
      if (transferableInput.getInput() instanceof StakeableLockIn) {
        inputComplexity[FeeDimensions.Bandwidth] += INTRINSIC_STAKEABLE_LOCKED_INPUT_BANDWIDTH;
      }
  
      const numberOfSignatures = transferableInput.getInput().getSigIdxs().length;
      const signatureBandwidth = numberOfSignatures * INTRINSIC_SECP256K1_FX_SIGNATURE_BANDWIDTH;
  
      inputComplexity[FeeDimensions.Bandwidth] += signatureBandwidth;
      inputComplexity[FeeDimensions.Compute] += numberOfSignatures * INTRINSIC_SECP256K1_FX_SIGNATURE_COMPUTE;
  
      complexity = addDimensions(complexity, inputComplexity);
    }
  
    return complexity;
  };

export const getSignerComplexity = (
    signer: Signer,
): Dimensions => {
    return createDimensions({
        bandwidth: INTRINSIC_POP_BANDWIDTH,
        dbRead: 0,
        dbWrite: 0,
        compute: INTRINSIC_BLS_POP_VERIFY_COMPUTE,
    });
};

const getBaseTxComplexity = (baseTx: BaseTx): Dimensions => {
    const outputsComplexity = getOutputComplexity(baseTx.getOuts());
    const inputsComplexity = getInputComplexity(baseTx.getIns());
  
    const complexity = addDimensions(outputsComplexity, inputsComplexity);
  
    complexity[FeeDimensions.Bandwidth] += baseTx.getMemo().length;
  
    return complexity;
};

export const getOwnerComplexity = (outputOwners: ParseableOutput): Dimensions => {
    const numberOfAddresses = outputOwners.getOutput().getAddresses().length;
    const addressBandwidth = numberOfAddresses * SHORT_ID_LEN;
  
    const bandwidth = addressBandwidth + INTRINSIC_SECP256K1_FX_OUTPUT_OWNERS_BANDWIDTH;
  
    return createDimensions({ bandwidth, dbRead: 0, dbWrite: 0, compute: 0 });
};

// Transaction types
const importTx = (tx: ImportTx): Dimensions => {
    return addDimensions(
        INTRINSIC_IMPORT_TX_COMPLEXITIES,
        getBaseTxComplexity(tx),
        getInputComplexity(tx.getImportInputs()),
    );
};

const exportTx = (tx: ExportTx): Dimensions => {
    return addDimensions(
        INTRINSIC_EXPORT_TX_COMPLEXITIES,
        getBaseTxComplexity(tx),
        getOutputComplexity(tx.getExportOutputs()),
    );
};

const addPermissionlessValidatorTx = (
    tx: AddPermissionlessValidatorTx,
): Dimensions => {
    return addDimensions(
        INTRINSIC_ADD_PERMISSIONLESS_VALIDATOR_TX_COMPLEXITIES,
        getBaseTxComplexity(tx),
        getSignerComplexity(tx.getSigner()),
        getOutputComplexity(tx.getStakeOuts()),
        getOwnerComplexity(tx.getValidatorRewardsOwner()),
        getOwnerComplexity(tx.getDelegatorRewardsOwner()),
    );
};

const addPermissionlessDelegatorTx = (
    tx: AddPermissionlessDelegatorTx,
): Dimensions => {
    return addDimensions(
        INTRINSIC_ADD_PERMISSIONLESS_DELEGATOR_TX_COMPLEXITIES,
        getBaseTxComplexity(tx),
        getOwnerComplexity(tx.getRewardOwners()),
        getOutputComplexity(tx.getStakeOuts()),
    );
};

const baseTx = (tx: BaseTx): Dimensions => {
    return addDimensions(
      INTRINSIC_BASE_TX_COMPLEXITIES,
      getBaseTxComplexity(tx),
    );
};

export const getTransactionComplexity = (tx: UnsignedTx): Dimensions => {
    if (tx.getTransaction() instanceof ImportTx) {
        return importTx(tx.getTransaction() as ImportTx);
    } else if (tx.getTransaction() instanceof ExportTx) {
        return exportTx(tx.getTransaction() as ExportTx);
    } else if (tx.getTransaction() instanceof AddPermissionlessValidatorTx) {
        return addPermissionlessValidatorTx(tx.getTransaction() as AddPermissionlessValidatorTx);
    } else if (tx.getTransaction() instanceof AddPermissionlessDelegatorTx) {
        return addPermissionlessDelegatorTx(tx.getTransaction() as AddPermissionlessDelegatorTx);
    } else if (tx.getTransaction() instanceof BaseTx) {
        return baseTx(tx.getTransaction() as BaseTx);
    } else {
        throw new Error("invalid tx type");
    }
}