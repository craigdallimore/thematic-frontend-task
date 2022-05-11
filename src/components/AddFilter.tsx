import React from "react";
import { Tooltip } from "reactstrap";
import { Column } from "../types";
import { Button } from "reactstrap";

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
        className="list-group-item list-group-item-action"
        type="button"
        onClick={() => {
          props.onChange(props.col.sampleHeader);
        }}
      >
        {props.col.sampleHeader}
      </button>
      {/*
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
        */}
    </>
  );
};

const AddFilter = (props: Props) => {
  const [showList, setShowList] = React.useState(false);

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
        <ul data-id="column-list" className="column-list list-group">
          {props.columns.map((col, index) => {
            const id = `${col.sampleHeader}-${index}`;
            return (
              <li key={id} className="list-group-item">
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
