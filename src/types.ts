export interface User {
  id: string;
  email: string;
}

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

export type SynopsisError = {
  code: string;
  description: string;
};

export type SynopsisResponse =
  | {
      data: Synopsis;
      status: string;
    }
  | SynopsisError;

export type FilterType = "Default" | "Data" | "Search" | "Score";
export type ScoreType = "Average" | "NPS" | "Threshold";

export type FilterId = string;

export type Filter = {
  id: FilterId;
  name: string;
  type: FilterType;
  scoreType: null | ScoreType;
};

export type FilterState = {
  isFetchingSynopsis: boolean;
  synopsis: null | Synopsis;
  error: null | SynopsisError;
  filters: Filter[];
};

export type FilterAction =
  | {
      type: "FILTER_ADDED";
      payload: string;
    }
  | {
      type: "FILTER_UPDATED";
      payload: Filter;
    }
  | {
      type: "FILTER_DELETED";
      payload: FilterId;
    }
  | {
      type: "FILTERS_UPDATED";
      payload: Filter[];
    }
  | {
      type: "FILTERS_CLEARED";
    }
  | {
      type: "SYNOPSIS_RECEIVED";
      payload: Synopsis;
    }
  | {
      type: "SYNOPSIS_ERROR_RECEIVED";
      payload: SynopsisError;
    };
