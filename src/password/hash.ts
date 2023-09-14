import { Hash, PlainText } from "./types";

export const hashPassword = (password: PlainText): Promise<Hash> => {
  return Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 4,
  });
};
