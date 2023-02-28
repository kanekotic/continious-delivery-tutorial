const express = require('express')
const health = require("./rutas/health")

module.exports = () => {
    const app = express()
    app.use("/health", health)
    return app
}