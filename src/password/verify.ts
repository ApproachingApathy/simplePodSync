import { Hash, PlainText } from "./types";

export const verifyPassword = (password: PlainText, hash: Hash): Promise<boolean> => {
    return Bun.password.verify(password, hash)
}