import filterReducer from "../filterReducer";
import { FilterAction, FilterState, Synopsis, Filter } from "../../types";
import { nanoid } from "nanoid";

const getInitialState = (changes = {}): FilterState => {
  return {
    isFetchingSynopsis: true,
    synopsis: null,
    error: null,
    filters: [],
    ...changes,
  };
};

const getSynopsis = (changes = {}): Synopsis => {
  return {
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
    ...changes,
  };
};

const getFilter = (changes = {}): Filter => {
  return {
    name: "",
    type: "Default",
    scoreType: null,
    id: nanoid(),
    ...changes,
  };
};

describe("FILTER_ADDED", () => {
  it(`- generates a filter based on the given column name
- assigns the filter an id
- assigns the filter the "Default" type`, () => {
    const initialState = getInitialState();

    const action: FilterAction = {
      type: "FILTER_ADDED",
      payload: "example",
    };

    expect(initialState.filters.length).toBe(0);

    const state = filterReducer(initialState, action);

    expect(state.filters.length).toBe(1);
    expect(state.filters[0].name).toBe(action.payload);
    expect(state.filters[0].type).toBe("Default");
    expect(state.filters[0].id).toBeTruthy();
  });
});

describe("FILTER_UPDATED", () => {
  it("replaces the existing filter with the updated version, other filters are unchanged", () => {
    const filter1 = getFilter({ name: "example-1", type: "Data" });
    const filter2 = getFilter({ name: "example-2", type: "Default" });
    const filter3 = getFilter({ name: "example-3", type: "Search" });

    const updatedFilter2 = {
      ...filter2,
      name: "example-2-renamed",
    };

    const initialState = getInitialState({
      filters: [filter1, filter2, filter3],
    });

    const action: FilterAction = {
      type: "FILTER_UPDATED",
      payload: updatedFilter2,
    };

    const state = filterReducer(initialState, action);

    expect(state.filters[0]).toEqual(filter1);
    expect(state.filters[1]).toEqual({
      ...filter2,
      name: "example-2-renamed",
    });
    expect(state.filters[2]).toEqual(filter3);
  });
});

describe("FILTER_DELETED", () => {
  it("removes the identified filter from the list", () => {
    const filter1 = getFilter({ name: "example-1", type: "Data" });
    const filter2 = getFilter({ name: "example-2", type: "Default" });
    const filter3 = getFilter({ name: "example-3", type: "Search" });

    const initialState = getInitialState({
      filters: [filter1, filter2, filter3],
    });

    expect(initialState.filters.length).toBe(3);

    // Remove filter 2
    const action: FilterAction = {
      type: "FILTER_DELETED",
      payload: filter2.id,
    };

    const state = filterReducer(initialState, action);

    // Show that only filter 1 and 3 remain
    expect(state.filters.length).toBe(2);
    expect(state.filters[0].id).toBe(filter1.id);
    expect(state.filters[1].id).toBe(filter3.id);
  });
});

describe("FILTERS_UPDATED", () => {
  it("replaces the full set of filters with a new set", () => {
    const filter1 = getFilter({ name: "example-1", type: "Data" });
    const filter2 = getFilter({ name: "example-2", type: "Default" });
    const filter3 = getFilter({ name: "example-3", type: "Search" });

    const initialState = getInitialState({
      filters: [filter1, filter2, filter3],
    });

    const action: FilterAction = {
      type: "FILTERS_UPDATED",
      payload: [filter3, filter1, filter2],
    };

    const state = filterReducer(initialState, action);

    expect(state.filters[0].id).toBe(filter3.id);
    expect(state.filters[1].id).toBe(filter1.id);
    expect(state.filters[2].id).toBe(filter2.id);
  });
});

describe("FILTERS_CLEARED", () => {
  it("empties the list of filters", () => {
    const filter1 = getFilter({ name: "example-1", type: "Data" });
    const filter2 = getFilter({ name: "example-2", type: "Default" });
    const filter3 = getFilter({ name: "example-3", type: "Search" });

    const initialState = getInitialState({
      filters: [filter1, filter2, filter3],
    });

    const action: FilterAction = {
      type: "FILTERS_CLEARED",
    };

    const state = filterReducer(initialState, action);

    expect(state.filters.length).toBe(0);
  });
});

describe("SYNOPSIS_RECEIVED", () => {
  it(`- assigns a synopsis to the synopsis field
- ensures the synopsis data quirks are addressed
`, () => {
    const initialState = getInitialState();
    const synopsis = getSynopsis();

    const action: FilterAction = {
      type: "SYNOPSIS_RECEIVED",
      payload: synopsis,
    };

    const state = filterReducer(initialState, action);

    expect(state.synopsis).not.toBe(null);
    expect(state.synopsis?.columns[0].sample).not.toContain("sample-header");
  });
  it("clears any received error information", () => {
    const initialState = getInitialState({
      error: {
        code: "",
        description: "",
      },
    });

    const synopsis = {
      columns: [],
      numColumns: -1,
      numRows: -1,
    };

    const action: FilterAction = {
      type: "SYNOPSIS_RECEIVED",
      payload: synopsis,
    };

    const state = filterReducer(initialState, action);

    expect(state.error).toBe(null);
  });
});

describe("SYNOPSIS_ERROR_RECEIVED", () => {
  it("stores the error object", () => {
    const initialState = getInitialState();

    const action: FilterAction = {
      type: "SYNOPSIS_ERROR_RECEIVED",
      payload: {
        code: "",
        description: "",
      },
    };

    const state = filterReducer(initialState, action);

    expect(state.error).toBe(action.payload);
  });
});
