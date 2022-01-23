const bcrypt = require("bcrypt");
const saltRounds = 10;

async function Hash(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function Verify(password, hash){
    return await bcrypt.compare(password, hash);
}

module.exports = {
    Hash,
    Verify
}