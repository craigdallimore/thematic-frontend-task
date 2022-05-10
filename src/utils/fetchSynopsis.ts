import { SynopsisResponse } from "../types";

export default async function fetchSynopsis(
  token: string
): Promise<SynopsisResponse> {
  const url = "/synopsis";
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 5% of the API calls incorrectly return 504, so we make 3 attempts in sequence.
  const body = await fetch(url, config)
    .catch(() => fetch(url, config))
    .catch(() => fetch(url, config))
    .then(async (res) => await res.json());

  return body;
}
