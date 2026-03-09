
export default async function handler(req, res) {
    const queryString = new URLSearchParams(req.query).toString();
    const apiKey = process.env.BONDOL_KEY;
    const apiUrl = process.env.BONDOL_URL;

    const referer = req.headers.referer;

    const allowedDomains = ["bondol-monitor.vercel.app", "localhost"];
    const isAllowed = allowedDomains.some(domain => referer && referer.includes(domain));

    if (!isAllowed) {
        return res.status(403).json({
            message: "Akses Ditolak: Anda tidak diizinkan mengakses data ini secara langsung."
        });
    }

    try {
        const targetUrl = `${apiUrl}/log?${queryString}`;
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey
            }
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Gagal memproses request ke API" });
    }
}