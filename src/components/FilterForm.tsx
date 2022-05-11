import React from "react";
import Loading from "./Loading";
import { FilterState, SynopsisResponse, SynopsisError } from "../types";
import filterReducer from "../utils/filterReducer";
import fetchSynopsis from "../utils/fetchSynopsis";
import { withAuth0, Auth0ContextInterface } from "@auth0/auth0-react";

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
    return <Loading />;
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
      <h2>Ok</h2>
      <ul data-id="filter-list"></ul>
      <button disabled>Save</button>
    </form>
  );
};

export default withAuth0(FilterForm);
