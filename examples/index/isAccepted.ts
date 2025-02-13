import { Metal } from "avalanche/dist"
import { IndexAPI } from "avalanche/dist/apis/index"
import { IsAcceptedResponse } from "avalanche/dist/apis/index/interfaces"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const avalanche: Metal = new Metal(ip, port, protocol, networkID)
const index: IndexAPI = avalanche.Index()

const main = async (): Promise<any> => {
  const id: string = "eLXEKFFMgGmK7ZLokCFjppdBfGy5hDuRqh5uJVyXXPaRErpAX"
  const encoding: string = "hex"
  const baseurl: string = "/ext/index/X/tx"
  const isContainerAccepted: IsAcceptedResponse = await index.isAccepted(
    id,
    encoding,
    baseurl
  )
  console.log(isContainerAccepted)
}

main()
