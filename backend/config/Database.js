import { Sequelize } from "sequelize";

const db = new Sequelize("auth_db", "root", "admin", {
    host: "localhost",
    dialect: "mysql",
})

db.authenticate()
    .then(() => {
        console.log("Connection has been established successfully.")
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err)
    })

export default db