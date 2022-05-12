import React from "react";
import { Column } from "../types";
import { Button } from "reactstrap";
import { usePopper } from "react-popper";

interface Props {
  columns: Column[];
  onChange: (sampleheader: string) => void;
}

const AddFilter = (props: Props) => {
  const [showList, setShowList] = React.useState(false);
  const [colIndex, setColIndex] = React.useState(-1);
  const [referenceElement, setReferenceElement] =
    React.useState<HTMLLIElement | null>(null);
  const [popperElement, setPopperElement] =
    React.useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = React.useState<HTMLDivElement | null>(
    null
  );
  const popper = usePopper(referenceElement, popperElement, {
    placement: "right",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
      {
        name: "arrow",
        options: {
          element: arrowElement,
        },
      },
    ],
  });

  const sample = props.columns[colIndex]?.sample ?? [];

  function handleMouseEnter(e: any, index: number) {
    const li = e.target as HTMLLIElement;
    setReferenceElement(li);
    setColIndex(index);
  }

  function handleMouseLeave() {
    setReferenceElement(null);
    setColIndex(-1);
  }

  return (
    <>
      <Button
        className="btn-add-filter"
        type="button"
        color="secondary"
        outline
        data-id="btn-add"
        onClick={() => setShowList(!showList)}
        disabled={props.columns.length === 0}
      >
        Add filter
      </Button>
      {showList && (
        <>
          <ul
            data-id="column-list"
            className="column-list list-group"
            onMouseLeave={handleMouseLeave}
          >
            {props.columns.map((col, index) => {
              const id = `${col.sampleHeader}-${index}`;
              return (
                <li
                  key={id}
                  className="list-group-item"
                  onMouseEnter={(e) => handleMouseEnter(e, index)}
                >
                  <button
                    id={id}
                    className="list-group-item list-group-item-action"
                    type="button"
                    onClick={() => {
                      props.onChange(col.sampleHeader);
                      setShowList(false);
                    }}
                  >
                    {col.sampleHeader}
                  </button>
                </li>
              );
            })}
          </ul>
          <div
            data-show={!!referenceElement}
            data-popper-placement="right"
            className="popper-tooltip"
            role="tooltip"
            ref={setPopperElement}
            style={popper.styles.popper}
            {...popper.attributes.popper}
          >
            <div
              ref={setArrowElement}
              data-popper-arrow="true"
              className="popper-arrow"
              style={popper.styles.arrow}
            />
            <ul className="sample-list">
              {sample.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default AddFilter;
