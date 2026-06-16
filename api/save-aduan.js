export const config = {
  api: {
    bodyParser: {
      sizeLimit: "15mb"
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
        action: "saveAduan",
        nama: body.nama,
        nomorHp: body.nomorHp,
        email: body.email,
        aduan: body.aduan,
        buktiAduan: body.buktiAduan
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
        detail: text.slice(0, 500)
      });
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengirim aduan ke Apps Script.",
      detail: error.message
    });
  }
}
