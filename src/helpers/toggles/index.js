const configcat = require("../configcat")
const isActive = async (toggleName, header) => {
    const user = {
        email: header.user
    } 
    return await configcat.getValueAsync(toggleName, false, user)
}

module.exports = { isActive }