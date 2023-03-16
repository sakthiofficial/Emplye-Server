import bcrypt from "bcrypt"
export async function gentratePassword(password) {
    let salt = await bcrypt.genSalt(10);
    let pass = await bcrypt.hash(password, salt);
    return pass

}

export async function comparePassword(userPaswoard, hashPassword) {
    let res = await bcrypt.compare(userPaswoard, hashPassword)
    return res
}
