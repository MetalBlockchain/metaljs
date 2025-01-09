/**
 * @packageDocumentation
 * @module Info-Interfaces
 */

import BN from "bn.js"

export interface GetBlockchainIDParams {
  alias: string
}

export interface IsBootstrappedParams {
  chain: string
}

export interface PeersParams {
  nodeIDs: string[]
}

export interface PeersResponse {
  ip: string
  publicIP: string
  nodeID: string
  version: string
  lastSent: string
  lastReceived: string
}

export interface GetTxFeeResponse {
  txFee: BN
  creationTxFee: BN
}

export interface UptimeResponse {
  rewardingStakePercentage: string
  weightedAveragePercentage: string
}

export interface UpgradesResponse {
  apricotPhase1Time: string;
  apricotPhase2Time: string;
  apricotPhase3Time: string;
  apricotPhase4Time: string;
  apricotPhase4MinPChainHeight: number;
  apricotPhase5Time: string;
  apricotPhasePre6Time: string;
  apricotPhase6Time: string;
  apricotPhasePost6Time: string;
  banffTime: string;
  cortinaTime: string;
  cortinaXChainStopVertexID: string;
  durangoTime: string;
  etnaTime: string;
}