import express, { Application } from "express"
import { startDatabase } from "./database/index"
import { devInfos, listAllDevs, listDevById } from "./logic/developers.logic"
import { createDeveloper } from "./logic/index"
import { confirmId, ensureEmailExists } from "./middlewares/confirmId"
 
const app: Application = express()
app.use(express.json())

app.post("/developers",ensureEmailExists, createDeveloper)
app.get("/developers", listAllDevs);
app.get("/developers/:id", confirmId, listDevById)
app.get("/developers/:id/projects",)
app.patch("/developers/:id", )
app.delete("/developers/:id", )
app.post("/developers/:id/infos", confirmId , devInfos )
app.patch("/developers/:id/infos", )


app.post("/projects", )
app.get("/projects/:id", )
app.get("/projects", )
app.patch("/projects/:id", )
app.delete("/projects/:id", )
app.post("/projects/:id/technologies", )    
app.delete("/projects/:id/technologies/:name", )


app.listen(3000, async () =>{
	await startDatabase()
    console.log("Server is running")    
})