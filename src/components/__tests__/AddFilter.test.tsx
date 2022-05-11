import React from "react";
import { render, fireEvent } from "@testing-library/react";
import AddFilter from "../AddFilter";
import { Column } from "../../types";

const getProps = (changes = {}) => {
  return {
    onChange: jest.fn(),
    columns: [] as Column[],
    ...changes,
  };
};

describe("AddFilter", () => {
  it("is disabled, given the synopsis has no columns", () => {
    const props = getProps();
    const { getByText } = render(<AddFilter {...props} />);

    const addButton = getByText("Add filter") as HTMLButtonElement;

    expect(props.columns.length).toBe(0);
    expect(addButton.disabled).toBe(true);
  });
  it("presents all the columns when the 'add filter' button is clicked", () => {
    const props = getProps({
      columns: [
        {
          colType: "Text",
          numRows: -1,
          numUniqueValues: -1,
          sample: ["a", "b", "c"],
          sampleHeader: "s1",
        },
        {
          colType: "Text",
          numRows: -1,
          numUniqueValues: -1,
          sample: ["d", "e", "f"],
          sampleHeader: "s2",
        },
      ],
    });
    const { container, getByText } = render(<AddFilter {...props} />);

    const addButton = getByText("Add filter") as HTMLButtonElement;
    expect(container.querySelector('[data-id="column-list"]')).toBe(null);

    fireEvent.click(addButton);

    const columnList = container.querySelector(
      '[data-id="column-list"]'
    ) as HTMLUListElement;
    expect(columnList).not.toBe(null);

    props.columns.forEach((col) => {
      expect(columnList.textContent).toContain(col.sampleHeader);
    });
  });

  test("clicking a column item will call a callback", () => {
    const props = getProps({
      columns: [
        {
          colType: "Text",
          numRows: -1,
          numUniqueValues: -1,
          sample: ["a", "b", "c"],
          sampleHeader: "s1",
        },
        {
          colType: "Text",
          numRows: -1,
          numUniqueValues: -1,
          sample: ["d", "e", "f"],
          sampleHeader: "s2",
        },
      ],
    });
    const { container, getByText } = render(<AddFilter {...props} />);

    const addButton = getByText("Add filter") as HTMLButtonElement;
    expect(container.querySelector('[data-id="column-list"]')).toBe(null);

    fireEvent.click(addButton);

    const items = Array.from(
      container.querySelectorAll('[data-id="column-list"] button')
    ) as HTMLButtonElement[];

    fireEvent.click(items[1]);

    expect(props.onChange).toBeCalledWith(props.columns[1].sampleHeader);
  });
});
