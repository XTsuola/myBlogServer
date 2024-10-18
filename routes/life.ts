// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { queryAll, update, findLast, add } from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { decode } from "https://deno.land/std@0.138.0/encoding/base64.ts";
import { getTime } from "./func.ts"

export function life(router: Router) {
    router.get("/life/imgList", async (ctx: any): Promise<void> => { // 获取生活图片
        const params: any = helpers.getQuery(ctx);
        const data: Document | undefined = await queryAll({status: 0}, "life_img");
        for(let i=0;i<data.length;i++) {
            delete data[i].status
        }
        const data2 = data.reverse();
        ctx.response.body = {
            "code": 200,
            "data": data2,
            "msg": "操作成功",
        };
    }).post("/life/add", async (ctx: any): Promise<void> => { // 新增生活图片
        const params: any = await ctx.request.body({
            type: "json",
        }).value;
        const lastInfo: Document[] = await findLast("life_img");
        let id: number = 0;
        if (lastInfo.length) {
            id = lastInfo[0].id;
        }
        const imgName: string = id + 1 + ".jpg";
        const path = `${Deno.cwd()}/public/life/${imgName}`;
        const base64: any = params.img.replace(
        /^data:image\/\w+;base64,/,
        "",
        );
        const dataBuffer: Uint8Array = decode(base64);
        await Deno.writeFile(path, dataBuffer);
        const sql = {
            id: id + 1,
            remark: params.remark,
            status: 0
        };
        const data: any = await add(sql, "life_img");
        ctx.response.body = {
            "code": 201,
            "msg": "新增成功",
        };
    }).get("/life/delete", async (ctx: any): Promise<void> => { // 删除生活图片
        const params: any = helpers.getQuery(ctx);
        const param1 = { id: parseInt(params.id) };
        const param2 = { status: 1 };
        const data = await update(param1, param2, "life_img");
        ctx.response.body = {
            "code": 200,
            "data": data,
            "msg": "操作成功",
        };
    })
}