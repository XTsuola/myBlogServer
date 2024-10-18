// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { queryOne, update } from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { key } from "../verifyToken/key.ts";

export function user(router: Router) {
    router.get("/user/info", async (ctx: any): Promise<void> => { // 获取用户信息
        const params: any = helpers.getQuery(ctx);
        const data: Document | undefined = await queryOne({ id: 1 }, "user");
        delete data.account;
        delete data.password;
        ctx.response.body = {
            "code": 200,
            "data": data,
            "msg": "操作成功",
        };
    }).get("/user/login", async (ctx: any): Promise<void> => { // 登录
        const params: any = helpers.getQuery(ctx);
        const sql = { account: params.account, password: params.password }
        const data = await queryOne(sql, "user")
        if (data) {
            const jwt: string = await create({ alg: "HS512", typ: "JWT" }, {
                account: params.account,
                date: Date.now(),
            }, key);
            const sql2 = { account: params.account };
            const data2: Document | undefined = await queryOne(sql2, "token");
            if (data2) {
              const param1 = { account: data2.account };
              const param2 = { token: jwt };
              await update(param1, param2, "token");
            } else {
              const lastInfo: Document[] = await findLast("token");
              let id: number = 0;
              if (lastInfo.length) {
                id = lastInfo[0].id;
              }
              const sql3 = {
                id: id + 1,
                account: params.account,
                token: jwt,
              };
              await add(sql3, "token");
            }
            await update({ id: data.id }, { status: 1 }, "user");
            ctx.response.body = {
                "code": 200,
                "data": {
                    id: data.id,
                    loginStatus: 1,
                    token: jwt
                },
                "msg": "登录成功",
            };
        } else {
            ctx.response.body = {
                "code": 401,
                "msg": "登录失败",
            };
        }
    }).get("/user/logout", async (ctx: any): Promise<void> => { // 退出登录登录
        const params: any = helpers.getQuery(ctx);
        const param1 = { id: parseInt(params.id) };
        const param2 = { status: 0 };
        await update(param1, param2, "user");
        ctx.response.body = {
            "code": 200,
            "msg": "退出成功",
        };
    })
}