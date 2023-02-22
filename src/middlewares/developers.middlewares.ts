import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database/index"

const confirmId = async ( request: Request, response: Response, next: NextFunction) : Promise<Response | void> => {
    const DeveloperID: number = Number(request.params.id)
    const queryID: string = 
    `
        SELECT
            *
        FROM
            developers
        WHERE
            id = $1;
    `
    const QueryConfig: QueryConfig = {
        text: queryID,
        values: [DeveloperID]
    }
    const QueryResult: QueryResult = await client.query(QueryConfig)
    
    if (QueryResult.rows[0] === 0) {
        return response.status(404).json({
            message: "Developer not found"
        })
      }
      
      
    return next()
}

const ensureEmailExists = async ( request: Request, response: Response, next: NextFunction) : Promise<Response | void> => {
    const email: string = request.body.email
    const query: string = 
    `
        SELECT
            *
        FROM
            developers
        WHERE
            email = $1
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [email]
    }
    const queryResult:  QueryResult = await client.query(queryConfig)

    if(queryResult.rowCount > 0){
        return response.status(409).json({
            message: "Email already exists."
        })
    }

    return next()
}

export { confirmId, ensureEmailExists }