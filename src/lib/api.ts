const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
const TOKEN = import.meta.env.VITE_API_TOKEN ?? "local-dev-token";

export class ApiError extends Error {
  readonly status: number; // 0 = request never reached the server

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function fetchApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        ...init?.headers,
      },
    });
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new ApiError(0, `Could not reach the API at ${path}: ${cause}`);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, `${path} responded ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`);
  }

  return (await res.json()) as T;
}
