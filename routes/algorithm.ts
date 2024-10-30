// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { queryAll, queryCount, queryOne, findLast, add, update } from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

export function algorithm(router: Router) {
    router.get("/algorithm/list", async (ctx: any): Promise<void> => { // 获取算法列表
        const params: any = helpers.getQuery(ctx);
        const total: number = await queryCount({}, "algorithm");
        const data: Document[] = await queryAll({}, "algorithm", parseInt(params.pageSize), parseInt(params.current));
        ctx.response.body = {
            "code": 200,
            "data": data,
            "total": total,
            "msg": "操作成功",
        };
    }).get("/algorithm/detail", async (ctx: any): Promise<void> => { // 获取算法详情
        const params: any = helpers.getQuery(ctx);
        const data: Document = await queryOne({ id: parseInt(params.id) }, "algorithm");
        ctx.response.body = {
            "code": 200,
            "data": data,
            "msg": "操作成功",
        };
    }).post("/algorithm/add", async (ctx: any): Promise<void> => { // 新增算法
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const lastInfo: Document[] = await findLast("algorithm");
        let id: number = 0;
        if (lastInfo.length) {
            id = lastInfo[0].id;
        }
        const sql = {
            id: id + 1,
            title: params.title,
            desc: params.desc,
            detail: params.detail
        };
        const data: any = await add(sql, "algorithm");
        ctx.response.body = {
            "code": 201,
            "msg": "新增成功",
        };
    }).post("/algorithm/edit", async (ctx: any): Promise<void> => { // 编辑算法
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const param1 = { id: parseInt(params.id) };
        const param2 = {
            title: params.title,
            desc: params.desc,
            detail: params.detail
        };
        const data = await update(param1, param2, "algorithm");
        ctx.response.body = {
            "code": 200,
            "msg": "编辑成功",
        };
    })
}