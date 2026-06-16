export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return sendPlaceholder(res, "ID foto tidak ditemukan");
  }

  const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, "");

  const urls = [
    `https://drive.google.com/thumbnail?id=${safeId}&sz=w1200`,
    `https://drive.google.com/uc?export=view&id=${safeId}`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) continue;
      if (!contentType.startsWith("image/")) continue;

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
      return res.status(200).send(buffer);

    } catch (error) {
      continue;
    }
  }

  return sendPlaceholder(res, "Foto tidak dapat dimuat");
}

function sendPlaceholder(res, text) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
      <rect width="100%" height="100%" fill="#f1f5f9"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        fill="#0a4f2d" font-family="Arial" font-size="24" font-weight="700">
        ${escapeXml(text)}
      </text>
    </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).send(svg);
}

function escapeXml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
