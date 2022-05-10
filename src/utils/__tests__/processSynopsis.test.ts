import processSynopsis from "../processSynopsis";
import {Synopsis} from "../../types";

describe("processSynopsis", () => {
  it('removes unexpected "sampleHeaders" from "sampleText" arrays', () => {
    const synopsis: Synopsis = {
      columns: [
        {
          colType: "Text",
          numRows: -1,
          numUniqueValues: -1,
          sample: ["allow1", "allow2", "sample-header", "allow3"],
          sampleHeader: "sample-header",
        },
      ],
      numColumns: -1,
      numRows: -1,
    };

    const actual = processSynopsis(synopsis);

    expect.assertions(synopsis.columns.length);

    actual.columns.forEach((col) => {
      expect(col.sample).not.toContain(col.sampleHeader);
    });
  });
});
