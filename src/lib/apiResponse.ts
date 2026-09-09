export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const body = await response.text();
    const preview = body.replace(/\s+/g, " ").slice(0, 120);
    throw new Error(
      `Request failed with ${response.status}: expected JSON but received ${preview || "an empty response"}`
    );
  }

  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || `Request failed with ${response.status}`);
  }

  return data;
}
