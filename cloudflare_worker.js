/**
 * Cloudflare Worker: Locket Gold, Spotify VIP & YouTube Premium CDN Proxy
 * Account: ngoanhlong352006
 * Repository: long788/Module_IOS
 */

const GITHUB_REPO = "long788/Module_IOS";
const GITHUB_BRANCH = "main";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Trang chủ kiểm tra trạng thái
    if (pathname === "/" || pathname === "") {
      return new Response("✨ Locket Gold, Spotify VIP & YouTube Premium Service is Online!\nWorker: " + url.hostname, {
        headers: { 
          "Content-Type": "text/plain; charset=utf-8", 
          "Access-Control-Allow-Origin": "*" 
        }
      });
    }

    // 2. Định tuyến file module / conf / script
    let targetPath = pathname.startsWith("/") ? pathname.substring(1) : pathname;

    // Hỗ trợ các tên gọi tắt (alias)
    if (targetPath === "module" || targetPath === "Locket_YouTube.sgmodule" || targetPath === "All_In_One.sgmodule") {
      targetPath = "All_In_One.sgmodule";
    } else if (targetPath === "conf" || targetPath === "All_In_One.conf") {
      targetPath = "All_In_One.conf";
    }

    const githubUrl = `${GITHUB_RAW}/${targetPath}`;

    try {
      const response = await fetch(githubUrl, {
        headers: {
          "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
          "Accept": "*/*"
        },
        cf: {
          cacheTtl: 30, // Tự động làm mới cache sau 30 giây khi có code/khung mới trên GitHub
          cacheEverything: true
        }
      });

      if (!response.ok) {
        return new Response(`File not found: ${targetPath}`, { 
          status: response.status,
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      }

      let content = await response.text();

      // 3. Tự động thay thế link GitHub bằng link trực tiếp của chính Worker này
      if (targetPath.endsWith(".sgmodule") || targetPath.endsWith(".conf")) {
        const workerOrigin = url.origin;
        content = content.replace(/https:\/\/raw\.githubusercontent\.com\/long788\/Module_IOS\/refs\/heads\/main/g, workerOrigin);
        content = content.replace(/https:\/\/raw\.githubusercontent\.com\/long788\/Module_IOS\/main/g, workerOrigin);
      }

      // Xác định định dạng trả về (MIME Type)
      let contentType = "text/plain; charset=utf-8";
      if (targetPath.endsWith(".js")) {
        contentType = "application/javascript; charset=utf-8";
      } else if (targetPath.endsWith(".mobileconfig")) {
        contentType = "application/x-apple-aspen-config; charset=utf-8";
      }

      return new Response(content, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=60"
        }
      });
    } catch (e) {
      return new Response("Worker Error: " + e.message, { status: 500 });
    }
  }
};
