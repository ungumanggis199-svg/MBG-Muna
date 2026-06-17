const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztD_tVnz-62Q48yGLz5UimIC_JszFYAsoM5V5DoM283OUzJ5a8tpWC5qfC7a9RZI91/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan."
    });
  }

  try {
    const body = req.body || {};

    const response = await fetch(APPS_SCRIPT_URL + "?t=" + Date.now(), {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        action: "daftarOperatorSppg",
        namaSppg: body.namaSppg,
        namaOperator: body.namaOperator,
        email: body.email,
        nomorWhatsapp: body.nomorWhatsapp
      })
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Respons Apps Script bukan JSON.",
        detail: text.slice(0, 500)
      });
    }

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mendaftarkan operator SPPG.",
      detail: error.message
    });
  }
}
