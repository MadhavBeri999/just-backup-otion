const BASE_URL = "http://localhost:8001"// change if needed

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("token")

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    })

    if (!res.ok) {
        throw new Error("API Error")
    }

    return res.json()
}