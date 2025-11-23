import { serve } from "bun";

function fixJsonKeys(text) {
  return text.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
}
function decodeUnicode(str) {
  return str.replace(/\\u[\dA-F]{4}/gi, m => 
    String.fromCharCode(parseInt(m.replace("\\u", ""), 16))
  );
}


serve({
  port: 3000,
  fetch: async (req) => {
    const url = new URL(req.url);

    console.log(url.pathname);

    // パス: /hivemind/:method/:param
    const pathParts = url.pathname.split("/").filter(Boolean); // 空文字削除

    // /hivemind/ に一致したときだけ処理
    if (pathParts[0] === "api") {
    //} else if (pathParts[0] === "method") {
      const method = pathParts[1] || "";
      let s = pathParts[2] || "";
      s = fixJsonKeys(decodeURIComponent(s));
      const param = JSON.parse(s);

      // JSON RPC風に返す例
      const body = JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        method,
        params: param
      });

      console.log(body)

      // backend に POST
      //const backend = await fetch("http://steememory.com:8888", {
      const backend = await fetch("https://api.steememory.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Host": "api.steememory.com",
        },
        body,
      });

      
      // backend のレスポンスをそのまま返す
      const data = await backend.text();
      return new Response(decodeUnicode(data), {
        status: backend.status,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // 上記以外のパス
    return new Response("bunbunbun: Not Found", { status: 404 });
  }
});
