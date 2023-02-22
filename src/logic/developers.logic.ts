import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database/index"
import {  DeveloperResult, IDeveloperRequest, IDeveloperInfoRequest, DeveloperInfoResult, DevInfo} from "../interfaces/developers.interfaces";

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
    );
    
    const queryConfig: QueryConfig = {
        text: queryString
    }
    
    const queryResult: DeveloperResult = await client.query(queryConfig);

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

const devInfos = async ( request: Request, response: Response): Promise<Response> => {
    try {
      const userId: number = Number(request.params.id);
      const { developerSince, preferredOS }: IDeveloperInfoRequest = request.body;
  
      const developerInfo = await client
        .query<DeveloperInfoResult>(
          `
          INSERT INTO 
              "developer_infos" ("developerSince", "preferredOS")
          VALUES ($1, $2)
          RETURNING *;
          `,
          [developerSince, preferredOS]
        )
        .then((result) => result.rows[0]);
  
      const { developerId } = await client
        .query<DeveloperInfoResult>(
          `
          UPDATE 
              "developers" 
          SET 
              "developerInfoID" = $1 
          WHERE 
              id = $2 
          RETURNING *;
          `,
          [developerInfo.id, userId]
        )
        .then((result) => result.rows[0]);
  
      return response.status(201).json(developerInfo);
    } catch (error) {
      return response.status(409).json({ message: "Insert correct values." });
    }
  };


export { createDeveloper, listAllDevs, listDevById, devInfos }