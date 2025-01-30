import { UnsignedTx, UTXO } from "..";
import { getTransactionComplexity } from "./complexity";
import { Dimensions, dimensionsToGas } from "./dimensions";

export const calculateFee = (
    tx: UnsignedTx,
    weights: Dimensions,
    price: bigint,
): bigint => {
    const complexity = getTransactionComplexity(tx);
    const gas = dimensionsToGas(complexity, weights);
  
    return gas * price;
};