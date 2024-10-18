// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { queryAll, queryOne, findLast, add, update } from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

export function learn(router: Router) {
    router.get("/learn/list", async (ctx: any): Promise<void> => { // 获取学习内容列表
        const params: any = helpers.getQuery(ctx);
        const data: Document[] = await queryAll({}, "learn");
        const data2 = data.sort((a,b) => {
            if(parseInt(a.time.slice(0,4)) != parseInt(b.time.slice(0,4))) {
                return parseInt(b.time.slice(0,4)) - parseInt(a.time.slice(0,4))
            } else {
                if(parseInt(a.time.slice(5,7)) != parseInt(b.time.slice(5,7))) {
                    return parseInt(b.time.slice(5,7)) - parseInt(a.time.slice(5,7))
                } else {
                    if(parseInt(a.time.slice(8,10)) != parseInt(b.time.slice(8,10))) {
                        return parseInt(b.time.slice(8,10)) - parseInt(a.time.slice(8,10))
                    } else {
                        return 0
                    }
                }
            }
        })
        ctx.response.body = {
            "code": 200,
            "data": data2,
            "msg": "操作成功",
        };
    }).get("/learn/detail", async (ctx: any): Promise<void> => { // 获取学习内容详情
        const params: any = helpers.getQuery(ctx);
        const data: Document = await queryOne({id: parseInt(params.id)}, "learn");
        ctx.response.body = {
            "code": 200,
            "data": data,
            "msg": "操作成功",
        };
    }).post("/learn/add", async (ctx: any): Promise<void> => { // 新增学习内容
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const lastInfo: Document[] = await findLast("learn");
        let id: number = 0;
        if (lastInfo.length) {
            id = lastInfo[0].id;
        }
        const sql = {
            id: id + 1,
            title: params.title,
            time: params.time,
            detail: params.detail
        };
        const data: any = await add(sql, "learn");
        ctx.response.body = {
            "code": 201,
            "msg": "新增成功",
        };
    }).post("/learn/edit", async (ctx: any): Promise<void> => { // 编辑学习内容
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const param1 = { id: parseInt(params.id) };
        const param2 = { 
            title: params.title,
            time: params.time,
            detail: params.detail
         };
        const data = await update(param1, param2, "learn");
        ctx.response.body = {
            "code": 200,
            "msg": "编辑成功",
        };
    })
}