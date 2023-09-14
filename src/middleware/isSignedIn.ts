import Elysia, { ElysiaInstance, Handler } from "elysia";
import { type setupPlugin } from "../plugins/setup";

type InstanceType = ReturnType<typeof setupPlugin> extends Elysia<infer T>
  ? Exclude<T, "meta" | "schema">
  : never;

export const isSignedIn: Handler<
  any,
  ElysiaInstance & Pick<InstanceType, "request" | "store">
> = ({ session, set }) => {
  if (!session) {
    set.status = 401;
    return "Unauthorized: Sign in";
  }
};
