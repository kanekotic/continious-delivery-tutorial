const { Router } = require("express")
const configcat = require("../../helpers/configcat")
const router = Router()

router.get('/', async (req, res) => {
    const extendhealth = await configcat.getValueAsync("extendhealth", false)
    if (extendhealth) {
        throw "Not implemented"
    }
    else{
        res.send()
    }
})

module.exports = router