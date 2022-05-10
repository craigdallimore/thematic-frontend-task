import { FilterState, FilterAction } from "../types";
import processSynopsis from "./processSynopsis";
import { nanoid } from "nanoid";

export default function filterReducer(
  state: FilterState,
  action: FilterAction
): FilterState {
  switch (action.type) {
    case "FILTER_ADDED": {
      return {
        ...state,
        filters: [
          ...state.filters,
          {
            name: action.payload,
            type: "Default",
            scoreType: null,
            id: nanoid(),
          },
        ],
      };
    }
    case "FILTER_UPDATED": {
      return {
        ...state,
        filters: state.filters.map((filter) =>
          filter.id === action.payload.id ? action.payload : filter
        ),
      };
    }
    case "FILTER_DELETED": {
      return {
        ...state,
        filters: state.filters.filter((filter) => filter.id !== action.payload),
      };
    }
    case "FILTERS_UPDATED": {
      return {
        ...state,
        filters: action.payload,
      };
    }
    case "FILTERS_CLEARED": {
      return {
        ...state,
        filters: [],
      };
    }
    case "SYNOPSIS_RECEIVED": {
      return {
        ...state,
        error: null,
        isFetchingSynopsis: false,
        synopsis: processSynopsis(action.payload),
      };
    }
    case "SYNOPSIS_ERROR_RECEIVED": {
      return {
        ...state,
        isFetchingSynopsis: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
}
