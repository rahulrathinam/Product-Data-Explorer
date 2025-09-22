export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000'

export async function apiGet<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' })
	if (!res.ok) {
		throw new Error(`API ${path} failed: ${res.status}`)
	}
	return res.json() as Promise<T>
}







