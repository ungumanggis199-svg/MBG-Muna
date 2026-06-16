export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan.",
      data: []
    });
  }

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztD_tVnz-62Q48yGLz5UimIC_JszFYAsoM5V5DoM283OUzJ5a8tpWC5qfC7a9RZI91/exec";

  try {
    const gasResponse = await fetch(APPS_SCRIPT_URL + "?t=" + Date.now(), {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        action: "getHariLibur"
      })
    });

    const text = await gasResponse.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Respons Apps Script bukan JSON.",
        detail: text.slice(0, 500),
        data: []
      });
    }

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data hari libur.",
      detail: error.message,
      data: []
    });
  }
}
