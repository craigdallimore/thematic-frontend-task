import React from "react";
import {
  FilterState,
  SynopsisResponse,
  SynopsisError,
  Filter,
  FilterId,
} from "../types";
import filterReducer from "../utils/filterReducer";
import fetchSynopsis from "../utils/fetchSynopsis";
import { withAuth0, Auth0ContextInterface } from "@auth0/auth0-react";
import AddFilter from "./AddFilter";
import FilterItem from "./FilterItem";

interface Props {
  auth0: Auth0ContextInterface;
}

const initialState: FilterState = {
  isFetchingSynopsis: true,
  synopsis: null,
  error: null,
  filters: [],
};

const FilterForm = (props: Props) => {
  const [state, dispatch] = React.useReducer(filterReducer, initialState);
  React.useEffect(() => {
    props.auth0
      .getAccessTokenSilently()
      .then((token) => fetchSynopsis(token))
      .then((response: SynopsisResponse) => {
        if ("data" in response) {
          dispatch({
            type: "SYNOPSIS_RECEIVED",
            payload: response.data,
          });
        }
      })
      .catch((e: SynopsisError) => {
        dispatch({
          type: "SYNOPSIS_ERROR_RECEIVED",
          payload: e,
        });
      });
  }, [props.auth0]);

  if (state.isFetchingSynopsis) {
    return <p className="text-center">Loading...</p>;
  }
  if (state.error) {
    return (
      <>
        <h2>An error occurred</h2>
        <pre>{JSON.stringify(state.error, null, 2)}</pre>
      </>
    );
  }

  return (
    <form>
      <legend>Filters</legend>
      <ul data-id="filter-list">
        {state.filters.map((filter: Filter) => (
          <FilterItem
            key={filter.id}
            filter={filter}
            onFilterChanged={(updatedFilter: Filter) => {
              dispatch({
                type: "FILTER_UPDATED",
                payload: updatedFilter,
              });
            }}
            onDelete={(id: FilterId) => {
              dispatch({
                type: "FILTER_DELETED",
                payload: id,
              });
            }}
          />
        ))}
      </ul>
      <AddFilter
        columns={state.synopsis?.columns ?? []}
        onChange={(sampleHeader: string) => {
          dispatch({
            type: "FILTER_ADDED",
            payload: sampleHeader,
          });
        }}
      />
      <button disabled>Save</button>
    </form>
  );
};

export default withAuth0(FilterForm);
