import { QueryResult } from "pg";

interface ProjectRequest {
  id: number,
  name: string,
  description: string,
  estimatedTime: Date,
  repository: string,
  startDate: Date,
  endDate: Date,
  developerId: number
}
interface Project extends ProjectRequest {
  id: number
}
interface Technology {
  id: number,
  name: string
}

interface ProjectTechnology {
  id: number,
  addedIn: string,
  projectId: number,
  technologyId: number
}

export type ProjectRequiredKeys = | "name" | "description" | "estimatedTime" | "repository" | "startDate" | "developerId"

type ProjRequestedKeys = keyof ProjectRequest;
type ProjectResult = QueryResult<Project>;

export { ProjectRequest, ProjectTechnology, Technology, ProjRequestedKeys, Project, ProjectResult }