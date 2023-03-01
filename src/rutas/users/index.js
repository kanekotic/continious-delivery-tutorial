const { Router } = require("express")
const router = Router()
const usersRepository = require("../../repository/clients")

router.get('/', async (req, res) => {
    res.send({users: usersRepository.getAllClients()})
})

router.post('/', async (req, res) => {
    usersRepository.addClients(req.body.name, req.header("X-Test") === 'true')
    res.send(201)
})

module.exports = router