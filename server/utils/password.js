const bcrypt = require("bcryptjs");
exports.HashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
exports.PlainPassword = async (password, HashPass) => {
    return await bcrypt.compare(password, HashPass);
};
