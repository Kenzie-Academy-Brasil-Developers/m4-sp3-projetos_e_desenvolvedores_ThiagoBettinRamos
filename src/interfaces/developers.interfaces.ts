import { QueryResult } from "pg"

interface IDeveloperRequest {
    id: number,
    name: string,
    email: string,
    developer_id: number
}
  
interface IDeveloperInfoRequest {
    developerSince: string,
    preferredOS: 'Windows' | 'Linux' | 'MacOS'
}
  
interface IDeveloperInfo extends IDeveloperInfoRequest {
    id: number,
    developer_id: number
}
  
interface IDeveloper extends IDeveloperRequest, IDeveloperInfo {}
  
type DeveloperResult = QueryResult<IDeveloperRequest>
type DeveloperInfoResult = QueryResult<IDeveloperInfo>
type DevInfo = QueryResult<IDeveloper>

export { DeveloperResult, IDeveloperRequest, IDeveloperInfoRequest, IDeveloperInfo, DevInfo, DeveloperInfoResult }
