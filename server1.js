import { serve } from "bun";

serve({
  port: 3000,
  fetch: async (req) => {
    const url = new URL(req.url);

    // パス: /hivemind/:method/:param
    const pathParts = url.pathname.split("/").filter(Boolean); // 空文字削除

    // /hivemind/ に一致したときだけ処理
    if (url.pathname === "/hivemind/") {
      // Nginx と同じ固定JSONボディ
      const body = JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        method: "hive.db_head_state",
        params: {}
      });

const body_text = JSON.stringify(body)
console.log(body_text)

      // backend に POST
      const backend = await fetch("http://steememory.com:8888", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Host": "steememory.com",
        },
        body,
      });

      // backend のレスポンスをそのまま返す
      const data = await backend.text();
      return new Response(data, {
        status: backend.status,
        headers: {
          "Content-Type": "application/json"
        }
      });

    } else if (pathParts[0] === "method") {

console.log(url.pathname)

      const method = pathParts[1] || "";
      //const param = pathParts[2] || "";

const param_text = "{"+decodeURIComponent(pathParts[2] || "")+"}";
console.log(param_text)

      const param = JSON.parse(param_text);

      // JSON RPC風に返す例
      const body = {
        jsonrpc: "2.0",
        id: 0,
        method,
        params: param
      };

const body_text = JSON.stringify(body)
console.log(body_text)

      // backend に POST
      const backend = await fetch("http://steememory.com:8888", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Host": "steememory.com",
        },
        body,
      });

      // backend のレスポンスをそのまま返す
      const data = await backend.text();
      return new Response(data, {
        status: backend.status,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }


    // 上記以外のパス
    return new Response("Not Found", { status: 404 });
  }
});
