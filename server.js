const express = require('express')

module.exports = () => {
    const app = express()
    app.get('/health', (req, res) => {
        res.send()
    })
    return app
}