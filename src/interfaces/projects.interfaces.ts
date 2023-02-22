import { QueryResult } from "pg";

interface IProjectRequest {
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: Date,
    endDate: Date,
    developerId: number | null
};

interface IProject extends IProjectRequest{
    id: number,
};

type ProjectResult = QueryResult<IProject>;

export { IProjectRequest, ProjectResult }