import React from "react";
import { nanoid } from "nanoid";
import { render, fireEvent } from "@testing-library/react";
import FilterItem from "../FilterItem";
import { Filter } from "../../types";
import initFontAwesome from "../../utils/initFontAwesome";

initFontAwesome();

const getFilter = (changes = {}): Filter => {
  return {
    name: "",
    type: "Default",
    scoreType: null,
    id: nanoid(),
    ...changes,
  };
};

const getProps = (changes = {}) => {
  return {
    filter: getFilter(),
    onFilterChanged: jest.fn(),
    onDelete: jest.fn(),
    ...changes,
  };
};

describe("FilterItem", () => {
  it("populates a text field with the filter name", () => {
    const props = getProps();
    const { container } = render(<FilterItem {...props} />);

    const textInput = container.querySelector(
      '[type="text"]'
    ) as HTMLInputElement;

    expect(textInput.value).toBe(props.filter.name);
  });

  test("changing the textfield will invoke a callback, passing an updated filter", () => {
    const props = getProps();
    const { container } = render(<FilterItem {...props} />);

    const textInput = container.querySelector(
      '[type="text"]'
    ) as HTMLInputElement;

    fireEvent.input(textInput, { target: { value: "next-name" } });

    const updatedFilter = props.onFilterChanged.mock.calls[0][0];

    expect(updatedFilter.name).toBe("next-name");
    expect(updatedFilter.type).toBe(props.filter.type);
    expect(updatedFilter.id).toBe(props.filter.id);
    expect(updatedFilter.scoreType).toBe(props.filter.scoreType);
  });

  it("has a dropdown exposing the available filter types", () => {
    const props = getProps();
    const { container } = render(<FilterItem {...props} />);

    expect(container.querySelector('option[value="Default"]')).toBeTruthy();
    expect(container.querySelector('option[value="Data"]')).toBeTruthy();
    expect(container.querySelector('option[value="Search"]')).toBeTruthy();
    expect(container.querySelector('option[value="Score"]')).toBeTruthy();
  });

  test("changing the type will invoke a callback, passing an updated filter", () => {
    const props = getProps();
    const { container } = render(<FilterItem {...props} />);

    const select = container.querySelector("select") as HTMLSelectElement;

    fireEvent.change(select, { target: { value: "Data" } });

    const updatedFilter = props.onFilterChanged.mock.calls[0][0];

    expect(updatedFilter.name).toBe(props.filter.name);
    expect(updatedFilter.type).toBe("Data");
    expect(updatedFilter.id).toBe(props.filter.id);
    expect(updatedFilter.scoreType).toBe(props.filter.scoreType);
  });

  test.each(["Default", "Data", "Search"])(
    "it does not have a Score button given the type is '%s'",
    (type) => {
      const filter = getFilter({ type });
      const props = getProps({ filter });
      const { container } = render(<FilterItem {...props} />);

      const scoreModalButton = container.querySelector(
        '[data-id="btn-score-modal"]'
      );
      expect(scoreModalButton).toBe(null);
    }
  );

  it("has a score button, given the type is 'Score'", () => {
    const filter = getFilter({ type: "Score" });
    const props = getProps({ filter });
    const { container } = render(<FilterItem {...props} />);

    const scoreModalButton = container.querySelector(
      '[data-id="btn-score-modal"]'
    );
    expect(scoreModalButton).not.toBe(null);
  });

  test("clicking the score button will reveal the score modal", () => {
    const filter = getFilter({ type: "Score" });
    const props = getProps({ filter });
    const { container, getByText } = render(<FilterItem {...props} />);

    const scoreModalButton = container.querySelector(
      '[data-id="btn-score-modal"]'
    ) as HTMLButtonElement;

    fireEvent.click(scoreModalButton);

    const modalHeader = getByText("Edit Filter");
    expect(modalHeader).not.toBe(null);
  });

  test("the score modal has a dropdown containing all the score types", () => {
    const filter = getFilter({ type: "Score" });
    const props = getProps({ filter });
    const { container } = render(<FilterItem {...props} />);

    const scoreModalButton = container.querySelector(
      '[data-id="btn-score-modal"]'
    ) as HTMLButtonElement;

    fireEvent.click(scoreModalButton);

    const modalBody = document.querySelector(
      '[data-id="modal-body"]'
    ) as HTMLDivElement;

    expect(modalBody.querySelector('option[value="Average"]')).toBeTruthy();
    expect(modalBody.querySelector('option[value="NPS"]')).toBeTruthy();
    expect(modalBody.querySelector('option[value="Threshold"]')).toBeTruthy();
  });

  test("cancelling the modal will not update the filter", () => {
    const filter = getFilter({ type: "Score" });
    const props = getProps({ filter });
    const { container } = render(<FilterItem {...props} />);

    const scoreModalButton = container.querySelector(
      '[data-id="btn-score-modal"]'
    ) as HTMLButtonElement;

    fireEvent.click(scoreModalButton);

    const btnCancelModal = document.querySelector(
      '[data-id="btn-cancel-modal"]'
    ) as HTMLButtonElement;

    fireEvent.click(btnCancelModal);

    expect(props.onFilterChanged).not.toBeCalled();
  });

  test("saving the modal will update the filter", () => {
    const filter = getFilter({ type: "Score" });
    const props = getProps({ filter });
    const { container } = render(<FilterItem {...props} />);

    const scoreModalButton = container.querySelector(
      '[data-id="btn-score-modal"]'
    ) as HTMLButtonElement;

    fireEvent.click(scoreModalButton);

    const btnSaveModal = document.querySelector(
      '[data-id="btn-save-modal"]'
    ) as HTMLButtonElement;

    fireEvent.click(btnSaveModal);

    const updatedFilter = props.onFilterChanged.mock.calls[0][0];

    expect(updatedFilter.name).toBe(props.filter.name);
    expect(updatedFilter.type).toBe(props.filter.type);
    expect(updatedFilter.id).toBe(props.filter.id);
    expect(updatedFilter.scoreType).toBe("Average");
  });

  test('clicking the "Delete" button will invoke a callback', () => {
    const filter = getFilter({ type: "Score" });
    const props = getProps({ filter });
    const { container } = render(<FilterItem {...props} />);

    const deleteButton = container.querySelector(
      '[data-id="btn-delete"]'
    ) as HTMLButtonElement;

    fireEvent.click(deleteButton);

    expect(props.onDelete).toBeCalledWith(props.filter.id);
  });
});
