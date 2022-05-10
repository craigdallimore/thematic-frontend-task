import { Synopsis } from "../types";

export default function processSynopsis(synopsis: Synopsis): Synopsis {
  return {
    ...synopsis,
    columns: synopsis.columns.map((col) => {
      return {
        ...col,
        // The API returns samples that unexpectedly include the sampleHeader.
        // Here we strip these out
        sample: col.sample.filter((x) => x !== col.sampleHeader),
      };
    }),
  };
}
