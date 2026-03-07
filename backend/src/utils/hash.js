import bcrypt from "bcryptjs";

export const hashPassword    = (password) => bcrypt.hash(password, 12);
export const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);
