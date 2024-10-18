// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { queryAll, queryOne, findLast, add, update } from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

export function msg(router: Router) {
    router.get("/msg/list", async (ctx: any): Promise<void> => { // 获取访客留言列表
        const params: any = helpers.getQuery(ctx);
        const data: Document[] = await queryAll({ status: 0 }, "msg");
        for (let i = 0; i < data.length; i++) {
            delete data[i].status
        }
        const data2 = data.sort((a, b) => {
            return new Date(b.time) - new Date(a.time)
        })
        ctx.response.body = {
            "code": 200,
            "data": data,
            "msg": "操作成功",
        };
    }).post("/msg/add", async (ctx: any): Promise<void> => { // 新增访客留言
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const lastInfo: Document[] = await findLast("msg");
        let id: number = 0;
        if (lastInfo.length) {
            id = lastInfo[0].id;
        }
        const sql = {
            id: id + 1,
            name: params.name,
            title: params.title,
            time: params.time,
            content: params.content,
            reply: "",
            status: 0
        };
        const data: any = await add(sql, "msg");
        ctx.response.body = {
            "code": 201,
            "msg": "新增成功",
        };
    }).post("/msg/reply", async (ctx: any): Promise<void> => { // 管理员回复
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const param1 = { id: parseInt(params.id) };
        const param2 = { reply: params.reply };
        const data = await update(param1, param2, "msg");
        ctx.response.body = {
            "code": 200,
            "msg": "编辑成功",
        };
    }).get("/msg/delete", async (ctx: any): Promise<void> => { // 删除访客留言
        const params: any = helpers.getQuery(ctx);
        const param1 = { id: parseInt(params.id) };
        const param2 = { status: 1 };
        const data = await update(param1, param2, "msg");
        ctx.response.body = {
            "code": 200,
            "data": data,
            "msg": "操作成功",
        };
    })
}