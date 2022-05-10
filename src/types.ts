export type ColType = "Text" | "Date" | "Number";

export type Synopsis = {
  columns: Array<{
    colType: ColType;
    numRows: number;
    numUniqueValues: number;
    sample: string[];
    sampleHeader: string;
  }>;
  numColumns: number;
  numRows: number;
};

export type SynopsisResponse =
  | {
      data: Synopsis;
      status: "success";
    }
  | {
      code: string;
      description: string;
    };
