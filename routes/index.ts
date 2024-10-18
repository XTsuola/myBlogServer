import { Router } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { user } from "./user.ts";
import { learn } from "./learn.ts";
import { travel } from "./travel.ts";
import { life } from "./life.ts";
import { msg } from "./msg.ts";
import { home } from "./home.ts";

const router = new Router();

user(router);
learn(router);
travel(router);
life(router);
msg(router);
home(router);

export default router;