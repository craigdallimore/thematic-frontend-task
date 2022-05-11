import React from "react";
import { Tooltip } from "reactstrap";
import { Column } from "../types";

interface Props {
  columns: Column[];
  onChange: (sampleheader: string) => void;
}

const Pair = (props: {
  id: string;
  col: Column;
  onChange: (sampleHeader: string) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <button
        id={props.id}
        type="button"
        onClick={() => {
          props.onChange(props.col.sampleHeader);
        }}
      >
        {props.col.sampleHeader}
      </button>
      <Tooltip
        placement="right"
        target={props.id}
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      >
        <ul>
          {props.col.sample.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </Tooltip>
    </>
  );
};

const AddFilter = (props: Props) => {
  const [showList, setShowList] = React.useState(false);

  return (
    <>
      <button
        type="button"
        data-id="btn-add"
        onClick={() => setShowList(!showList)}
        disabled={props.columns.length === 0}
      >
        Add filter
      </button>
      {showList && (
        <ul data-id="column-list">
          {props.columns.map((col, index) => {
            const id = `${col.sampleHeader}-${index}`;
            return (
              <li key={id}>
                <Pair
                  id={id}
                  col={col}
                  onChange={(s: string) => {
                    setShowList(false);
                    props.onChange(s);
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default AddFilter;
