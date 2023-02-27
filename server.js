const express = require('express')

module.exports = () => {
    const app = express()
    app.get('/health', (req, res) => {
        res.send({ general: true })
    })
    const server = app.listen(3000, () => {
        console.log("mi servidor esta funcionando")
    })
    return {app, server}
}