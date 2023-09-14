import Elysia, { ElysiaInstance, Handler } from "elysia";
import { type setupPlugin } from "../plugins/setup";

type InstanceType = ReturnType<typeof setupPlugin> extends Elysia<infer T>
  ? T
  : never;

export const isUserNameSessionAndPathMatch: Handler<
  any,
  ElysiaInstance & { request: Pick<InstanceType["request"], "session"> }
> = ({ session, set, params }) => {
  if (params.username && session?.user.username !== params.username) {
    set.status = 400;
    return "Attempted operation on invalid user.";
  }
};
