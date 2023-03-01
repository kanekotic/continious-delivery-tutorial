const { Router } = require("express")
const toggles = require("../../helpers/toggles")
const router = Router()

router.get('/', async (req, res) => {
    const extendhealth = await toggles.isActive("extendhealth", req.headers)
    if (extendhealth) {
        res.send({general: true})
    }
    else{
        res.send()
    }
})

module.exports = router