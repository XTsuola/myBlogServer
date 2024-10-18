// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { queryAll, queryOne, findLast, add, update } from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { verifyToken } from "../verifyToken/index.ts";

export function home(router: Router) {
    router.get("/home_info/list", async (ctx: any): Promise<void> => { // 获取首页列表
        const params: any = helpers.getQuery(ctx);
        const data: Document[] = await queryAll({status: 0}, "home_info");
        
        ctx.response.body = {
            "code": 200,
            "data": data,
            "msg": "操作成功",
        };
    }).get("/home_info/detail", async (ctx: any): Promise<void> => { // 获取首页列表详情
        const params: any = helpers.getQuery(ctx);
        const data: Document = await queryOne({id: parseInt(params.id)}, "home_info");
        ctx.response.body = {
            "code": 200,
            "data": data,
            "msg": "操作成功",
        };
    }).post("/home_info/add", verifyToken, async (ctx: any): Promise<void> => { // 新增首页列表
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const lastInfo: Document[] = await findLast("home_info");
        let id: number = 0;
        if (lastInfo.length) {
            id = lastInfo[0].id;
        }
        const sql = {
            id: id + 1,
            title: params.title,
            level: params.level,
            info: params.info,
            status: 0
        };
        const data: any = await add(sql, "home_info");
        ctx.response.body = {
            "code": 201,
            "msg": "新增成功",
        };
    }).post("/home_info/edit", verifyToken, async (ctx: any): Promise<void> => { // 编辑首页列表
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const param1 = { id: parseInt(params.id) };
        const param2 = { 
            title: params.title,
            time: params.time,
            level: params.level,
            info: params.info
         };
        const data = await update(param1, param2, "home_info");
        ctx.response.body = {
            "code": 200,
            "msg": "编辑成功",
        };
    })
}