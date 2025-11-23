import { serve } from "bun";

function fixJsonKeys(text) {
  return text.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
}
function decodeUnicode(str) {
  return str.replace(/\\u[\dA-F]{4}/gi, m => 
    String.fromCharCode(parseInt(m.replace("\\u", ""), 16))
  );
}
//IPアドレスを取得する
function getClientIP(req: Request): string {
    const remote = (req as any).remoteAddr;
    if (remote?.address) return remote.address;

    const ip2 = req.headers.get("x-forwarded-for");
    if (ip2) {
        const [first] = ip2.split(",");
        return first!.trim();
    }

    const ip3 = req.headers.get("x-real-ip");
    if (ip3) return ip3;

    return "unknown";
}
//IPV6からIPV4を抽出する
function toIPv4(ip: string | null | undefined): string {
  if (!ip) return "unknown";

  // IPv4-mapped IPv6 形式（::ffff:x.x.x.x）
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) {
    return mapped[1];
  }

  // 通常の IPv4
  if (ip.includes(".")) {
    return ip;
  }

  // それ以外は IPv4 に変換できない（IPv6 のまま）
  return ip;
}


const server = Bun.serve({
  port: 3000,
  fetch: async (req) => {
    const url = new URL(req.url);

    //ログ
    const ip = getClientIP(req,);
    const now = new Date().toISOString();
    console.log(`[${now}] IP=${ip} METHOD=${req.method} PATH=${url.pathname}`);
    console.log("Headers:", Object.fromEntries(req.headers));

    const rawIP = server.requestIP(req);  // Bun からの実 IP
    const ipv4 = toIPv4(rawIP);           // IPv4 形式に変換
　　console.log(`[IP] raw: ${rawIP}, ipv4: ${ipv4}`);

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
