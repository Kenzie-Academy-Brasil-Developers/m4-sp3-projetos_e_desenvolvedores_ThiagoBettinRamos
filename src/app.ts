import express, { Application } from "express"
import { startDatabase } from "./database/index"
import { createDeveloper, deleteDeveloper, devInfos, listAllDevs, listDevById, updateDeveloperInfo, updateDeveloper } from "./logic/developers.logic"
import { confirmId, ensureEmailExists } from "./middlewares/developers.middlewares"
import { createProject } from "./logic/projects.logic"

const app: Application = express()
app.use(express.json())

app.post("/developers",ensureEmailExists, createDeveloper )
app.get("/developers", listAllDevs )
app.get("/developers/:id", confirmId, listDevById )
app.get("/developers/:id/projects",)
app.patch("/developers/:id", confirmId, updateDeveloper )
app.delete("/developers/:id", confirmId, deleteDeveloper )
app.post("/developers/:id/infos", confirmId , devInfos )
app.patch("/developers/:id/infos", confirmId, updateDeveloperInfo )


app.post("/projects", confirmId, createProject )
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