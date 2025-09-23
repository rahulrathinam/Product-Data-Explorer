export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://product-data-explorer-17g9.onrender.com'

export async function apiGet<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' })
	if (!res.ok) {
		throw new Error(`API ${path} failed: ${res.status}`)
	}
	return res.json() as Promise<T>
}







