import { Request, Response } from 'express'
import { QueryConfig, QueryResult } from 'pg'
import format from 'pg-format'
import { client } from '../database/index'
import { DeveloperResult, IDeveloperRequest, IDeveloperInfoRequest, IDeveloperInfo, DevInfo, DeveloperInfoResult } from '../interfaces/developers.interfaces'

const createDeveloper = async (request: Request, response: Response) : Promise<Response> => {
    const developerDate : IDeveloperRequest = request.body
    if(!developerDate.name) {
        return response.status(400).send({
            message: 'Missing required keys: name.'
        })
    }
    if(!developerDate.email) {
        return response.status(400).send({
            message: 'Missing required keys: email.'
        })
    }
    const queryString = format(
        `
        INSERT INTO
            developers(name, email)
        VALUES(%L, %L)
        RETURNING *;
        `,
        developerDate.name,
        developerDate.email
    )
    
    const queryConfig: QueryConfig = {
        text: queryString
    }
    
    const queryResult: DeveloperResult = await client.query(queryConfig)

    return response.status(201).json(queryResult.rows[0])
}

const listAllDevs = async ( request: Request, response: Response ) : Promise<Response> => {
    const query = `
        SELECT 
            d.*,
            di."developerSince",
            di."preferredOS" 
        FROM
            developers d
        LEFT JOIN
            developers_info di 
        ON
            d."developerInfoId" = di.id
        ORDER BY
        id ASC;
    `
    const queryConfig: string = format(query)

    const queryResult: DevInfo = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows)
}
  
const listDevById = async ( request: Request, response: Response ) : Promise<Response> => {
    const devId: number = parseInt(request.params.id)
    const query: string = 
    `
    SELECT 
        d.*,
        di."developerSince",
        di."preferredOS",
        d."developerInfoId" 
    FROM 
        developers d
    LEFT JOIN 
        developers_info di
    ON 
        d."developerInfoId" = di.id
    WHERE 
        d."id" = $1
    ORDER BY
        id ASC;
    `
    const queryConfig: QueryConfig = {
        text:query,
        values: [devId]
    }
    
    const queryResult: DevInfo = await client.query(queryConfig)
    return response.status(200).json(queryResult.rows[0])
}

const devInfos = async (request: Request, response: Response): Promise<Response> => {
    try {
      const userId: number = Number(request.params.id)
      const { developerSince, preferredOS }: IDeveloperInfoRequest = request.body
  
      const developerInfo = await client.query<IDeveloperInfo>(
          `
          INSERT INTO 
              "developers_info" ("developerSince", "preferredOS")
          VALUES ($1, $2)
          RETURNING *;
          `,
          [developerSince, preferredOS]
        ).then((result) => result.rows[0])
  
      const { id: developerId } = await client.query<IDeveloperRequest>(
          `
          UPDATE 
              "developers" 
          SET 
              "developerInfoId" = $1 
          WHERE 
              id = $2 
          RETURNING "id";
          `,
          [developerInfo.id, userId]
        ).then((result) => result.rows[0]);
  
      return response.status(201).json({ id: developerInfo.id, developerInfoId: developerId })
    }catch (error) {
      return response.status(409).json({ message: 'Insert correct values.' })
    }
}
const updateDeveloper = async (request: Request, response: Response): Promise<Response> => {
    try {
      const userId: number = Number(request.params.id)
      const { name, email }: IDeveloperRequest = request.body
      
      const result = await client.query<IDeveloperRequest>(
        `
        UPDATE 
            "developers" 
        SET 
            name = COALESCE($1, name),
            email = COALESCE($2, email)
        WHERE 
            id = $3
        RETURNING *
        `,
        [name, email, userId]
      )
  
      if (result.rowCount === 0) {
        return response.status(404).json({ message: 'Developer not found' })
      }
  
      const developer = result.rows[0]
  
      return response.status(200).json(developer)
    } catch (error) {
      return response.status(400).json({ message: 'At least one of those keys must be send.', keys: ['name', 'email'] })
    }
  }


const updateDeveloperInfo = async (request: Request, response: Response): Promise<Response> => {
    const developerId: number = Number(request.params.id)
    const { developerSince, preferredOS }: IDeveloperInfoRequest = request.body
  
    if (!developerSince && !preferredOS) {
      return response.status(400).json({
        message: 'At least one of those keys must be sent.',
        keys: ['developerSince', 'preferredOS']
      })
    }
  
    const updatedInfo = await client.query<IDeveloperInfo>(
        `
        UPDATE developers_info
        SET "developerSince" = COALESCE($1, "developerSince"), "preferredOS" = COALESCE($2, "preferredOS")
        WHERE id = (
          SELECT "developerInfoId"
          FROM developers
          WHERE id = $3
        )
        RETURNING *
      `,
        [developerSince, preferredOS, developerId]
      )
      .then((result) => result.rows[0])
  
    if (!updatedInfo) {
      return response.status(404).json({ message: 'Developer not found' })
    }
  
    const { id, developerSince: updatedDeveloperSince, preferredOS: updatedPreferredOS } = updatedInfo
  
    return response.status(200).json({ id, developerSince: updatedDeveloperSince, preferredOS: updatedPreferredOS })
  }

const deleteDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const developerId: number = parseInt(request.params.id)

    const query: string = `
        DELETE FROM 
            developers 
        WHERE 
            id = $1
    `;

    const queryConfig: QueryConfig = {
        text: query,
        values: [developerId]
    }

    const result = await client.query(queryConfig)

    if (result.rowCount === 0) {
        return response.status(404).json({ message: "Developer not found" })
    }

    return response.status(204).send()
}

export { createDeveloper, listAllDevs, listDevById, devInfos, updateDeveloperInfo, deleteDeveloper, updateDeveloper }  