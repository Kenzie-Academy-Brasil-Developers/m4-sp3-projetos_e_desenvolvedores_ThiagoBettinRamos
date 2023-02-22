import { Request, Response } from 'express'
import { QueryConfig, QueryResult } from 'pg'
import format from 'pg-format';
import { client } from '../database/index'
import { ProjectRequiredKeys, ProjectResult } from '../interfaces/projects.interfaces'

const createProject = async ( request: Request, response: Response ): Promise<Response> => {

  const { name, description, estimatedTime, repository, startDate, developerId} = request.body
  const requiredKeys: ProjectRequiredKeys[] = [ 'name', 'description', 'estimatedTime', 'repository', 'startDate','developerId']
  const requestKeys = Object.keys(request.body)
  const AllKeys = requiredKeys.every((key) => requestKeys.includes(key))

  if (!AllKeys) {
    return response.status(400).json({
      message: `Required keys are: ${requiredKeys}.`
    })
  }

  const query: string = `
    INSERT INTO 
      "projects"
      ("name", 
      "description",
      "estimatedTime",
      "repository",
      "startDate",
      "developerId")
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [
      name,
      description,
      estimatedTime,
      repository,
      startDate,
      developerId
    ]
  }

  const queryResult: ProjectResult = await client.query(queryConfig)

  return response.status(201).json(queryResult.rows[0])
}

export { createProject }