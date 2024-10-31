// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { queryAll, update, findLast, add } from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { decode } from "https://deno.land/std@0.138.0/encoding/base64.ts";
import { getTime } from "./func.ts"

export function life(router: Router) {
    router.get("/life/recordList", async (ctx: any): Promise<void> => { // 获取生活图片
        const params: any = helpers.getQuery(ctx);
        const data: Document | undefined = await queryAll({}, "life_record");
        for (let i = 0; i < data.length; i++) {
            delete data[i].status
        }
        const data2 = data.reverse();
        ctx.response.body = {
            "code": 200,
            "data": data2,
            "msg": "操作成功",
        };
    })
}