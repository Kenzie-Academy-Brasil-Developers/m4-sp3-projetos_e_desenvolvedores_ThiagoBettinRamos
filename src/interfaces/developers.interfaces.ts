import { QueryResult } from "pg"

interface IDeveloperRequest {
  id: number;
  name: string;
  email: string;
}

interface IDeveloperInfoRequest {
  developerSince: string;
  preferredOS: string;
}

interface IDeveloperInfo extends IDeveloperInfoRequest {
  id: number;
  developerId: number;
}

interface IDeveloper extends IDeveloperInfoRequest, IDeveloperInfo {}

type DeveloperResult = QueryResult<IDeveloperRequest>;
type DeveloperInfoResult = QueryResult<IDeveloperInfo>;
type DevInfo = QueryResult<IDeveloper>;

export { DeveloperResult, IDeveloperRequest, IDeveloperInfoRequest, IDeveloperInfo, DevInfo, DeveloperInfoResult };
