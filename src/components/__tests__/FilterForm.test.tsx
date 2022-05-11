import React from "react";
import fetchMock from "jest-fetch-mock";
import { nanoid } from "nanoid";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import FilterForm from "../FilterForm";
import fetchSynopsis from "../../utils/fetchSynopsis";
import { Synopsis } from "../../types";
import initFontAwesome from "../../utils/initFontAwesome";

initFontAwesome();

fetchMock.enableMocks();

const mockedFetchSynopsis = fetchSynopsis as jest.MockedFunction<
  typeof fetchSynopsis
>;

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

jest.mock("../../utils/fetchSynopsis", () =>
  jest.fn(() => Promise.resolve({ data: {} }))
);

jest.mock("@auth0/auth0-react", () => {
  // The component exported from FilterForm is wrapped in this HOC.
  // Here we mock the HOC for convenience and to avoid side-effects.
  const withAuth0Mock = jest.fn(
    <P extends Object>(Component: React.ComponentType<P>) =>
      (props: P) =>
        (
          <Component
            {...props}
            auth0={{
              getAccessTokenSilently: jest.fn(() => Promise.resolve("token")),
            }}
          />
        )
  );

  return {
    withAuth0: withAuth0Mock,
  };
});

const getProps = (changes = {}) => {
  return {
    user: {
      email: "example@example.com",
      id: nanoid(),
    },
    ...changes,
  };
};

describe("Initial state", () => {
  beforeAll(() => {
    global.fetch.mockResponse(() => Promise.resolve("{}"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchSynopsis.mockImplementation(() =>
      Promise.resolve({ data: getSynopsis(), status: "success" })
    );
  });

  it("presents a loading state", async () => {
    const props = getProps();
    render(<FilterForm {...props} />);
    const spinner = await screen.findByText("Loading...");
    expect(spinner).toBeDefined();
  });
  it("fetches synopsis data (once)", async () => {
    const props = getProps();
    render(<FilterForm {...props} />);
    await waitFor(() => expect(mockedFetchSynopsis).toBeCalledTimes(1));
  });
});

describe("Given an error occurred fetching the synopsis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchSynopsis.mockImplementation(() =>
      Promise.reject({ code: "", decription: "" })
    );
  });

  it("conceals the loading state", async () => {
    const props = getProps();
    const { queryByText } = render(<FilterForm {...props} />);
    await waitFor(() => expect(mockedFetchSynopsis).toBeCalled());

    expect(queryByText("Loading...")).toBe(null);
  });
  it("shows an error state", async () => {
    const props = getProps();
    const { getByText } = render(<FilterForm {...props} />);
    await waitFor(() => expect(mockedFetchSynopsis).toBeCalled());

    const errorMessage = getByText("An error occurred");

    expect(errorMessage).not.toBe(null);
  });
});
describe("Given a synopsis was received", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchSynopsis.mockImplementation(() =>
      Promise.resolve({ data: getSynopsis(), status: "success" })
    );
  });

  it("conceals the loading state", async () => {
    const props = getProps();
    const { queryByText } = render(<FilterForm {...props} />);
    await waitFor(() => expect(mockedFetchSynopsis).toBeCalled());

    expect(queryByText("Loading...")).toBe(null);
  });
  it("shows a save button, initially disabled", async () => {
    const props = getProps();
    const { getByText } = render(<FilterForm {...props} />);
    await waitFor(() => expect(mockedFetchSynopsis).toBeCalled());

    const saveButton = getByText("Save") as HTMLButtonElement;

    expect(saveButton).not.toBe(null);
    expect(saveButton.disabled).toBe(true);
  });
  it("shows the filter list component", async () => {
    const props = getProps();
    const { container } = render(<FilterForm {...props} />);
    await waitFor(() => expect(mockedFetchSynopsis).toBeCalled());

    const list = container.querySelector('[data-id="filter-list"]');

    expect(list).not.toBe(null);
  });
});

describe("Adding a filter", () => {
  test(`given a filter is added
- it will be reflected in the list
- the save button will be enabled
`, async () => {
    const props = getProps();
    const { container, getByText } = render(<FilterForm {...props} />);
    await waitFor(() => expect(mockedFetchSynopsis).toBeCalled());

    const addButton = container.querySelector(
      '[data-id="btn-add"]'
    ) as HTMLButtonElement;
    const filterList = container.querySelector(
      '[data-id="filter-list"]'
    ) as HTMLUListElement;
    const saveButton = getByText("Save") as HTMLButtonElement;

    expect(filterList.childNodes.length).toBe(0);
    expect(saveButton.disabled).toBe(true);

    fireEvent.click(addButton);

    const columnButton = container.querySelector(
      '[data-id="column-list"] button:first-of-type'
    ) as HTMLButtonElement;

    fireEvent.click(columnButton);

    expect(filterList.childNodes.length).toBe(1);
    expect(saveButton.disabled).toBe(false);
  });

  test("clearing the form will empty the list", async () => {
    const props = getProps();
    const { container, getByText } = render(<FilterForm {...props} />);
    await waitFor(() => expect(mockedFetchSynopsis).toBeCalled());

    const addButton = container.querySelector(
      '[data-id="btn-add"]'
    ) as HTMLButtonElement;
    const filterList = container.querySelector(
      '[data-id="filter-list"]'
    ) as HTMLUListElement;
    const clearButton = getByText("Clear") as HTMLButtonElement;

    fireEvent.click(addButton);

    const columnButton = container.querySelector(
      '[data-id="column-list"] button:first-of-type'
    ) as HTMLButtonElement;

    fireEvent.click(columnButton);

    expect(filterList.childNodes.length).toBe(1);

    fireEvent.click(clearButton);

    expect(filterList.childNodes.length).toBe(0);
  });

  // TODO given duplicate filter names, a warning is shown
  // TODO given empty filter names, a warning is shown

  test("clicking the save button will reveal the filter state", () => {});

  // TODO TBC clicking the save button will clear the list?
});

// TODO clicking the delete button will remove the filter from the list
