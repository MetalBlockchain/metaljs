import { Metal } from "avalanche/dist"
import { PlatformVMAPI } from "avalanche/dist/apis/platformvm"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const avalanche: Metal = new Metal(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()

const main = async (): Promise<any> => {
  const stakingAssetID: string = await pchain.getStakingAssetID()
  console.log(stakingAssetID)
}

main()
