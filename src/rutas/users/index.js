const { Router } = require("express")
const router = Router()

let users = []

router.get('/', async (req, res) => {
    res.send({ users })
})

router.post('/', async (req, res) => {
    users = [...users, req.body]
    res.send(201)
})

module.exports = router