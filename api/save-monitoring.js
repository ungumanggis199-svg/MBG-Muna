export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan."
    });
  }

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxl7u7NeBrpaXxylVCRmKqhIapX2nRRZN0l5vRu2mDwP3CkJBmRDUopBmbiRoAix_YB/exec";

  try {
    const body = req.body || {};

    const gasResponse = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "saveMonitoring",
        email: body.email,
        password: body.password,
        namaSppg: body.namaSppg,
        tanggal: body.tanggal,
        menuMbg: body.menuMbg,
        nilaiGizi: body.nilaiGizi,
        fotoMenu: body.fotoMenu,
        fotoDistribusi: body.fotoDistribusi
      })
    });

    const text = await gasResponse.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Respons Apps Script bukan JSON. Cek deploy Apps Script.",
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
