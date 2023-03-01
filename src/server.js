const express = require('express')
const health = require("./rutas/health")
const users = require("./rutas/users")

module.exports = () => {
    const app = express()
    app.use(express.json());
    app.use("/health", health)
    app.use("/users", users)
    return app
}