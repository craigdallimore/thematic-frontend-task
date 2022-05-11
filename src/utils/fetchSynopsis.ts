import { SynopsisResponse } from "../types";

const makeRequest = async (url: string, config: RequestInit) => {
  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return response;
};

export default async function fetchSynopsis(
  token: string
): Promise<SynopsisResponse> {
  const url =
    "https://q7hu82zjef.execute-api.us-east-1.amazonaws.com/staging/synopsis";
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 5% of the API calls incorrectly return 504, so we make 3 attempts in sequence.
  const body = await makeRequest(url, config)
    .catch(() => makeRequest(url, config))
    .catch(() => makeRequest(url, config))
    .then(async (res) => await res.json());

  return body;
}
