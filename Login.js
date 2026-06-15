export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan."
    });
  }

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqFpjF5B_QnX7MO4RSm3IBQ9B0dZnPPP6qbJqCyXp_w4Uc_T6pVigcWmVBdE6ynBGW/exec";

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi."
      });
    }

    const gasResponse = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "login",
        email,
        password
      })
    });

    const text = await gasResponse.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Respons Apps Script bukan JSON. Cek deployment Apps Script.",
        detail: text.slice(0, 200)
      });
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghubungi Apps Script.",
      detail: error.message
    });
  }
}
