import React from "react";
import { Column } from "../types";

interface Props {
  columns: Column[];
  onChange: (sampleheader: string) => void;
}

const AddFilter = (props: Props) => {
  const [showList, setShowList] = React.useState(false);

  return (
    <>
      <button
        data-id="btn-add"
        onClick={() => setShowList(!showList)}
        disabled={props.columns.length === 0}
      >
        Add filter
      </button>
      {showList && (
        <ul data-id="column-list">
          {props.columns.map((col, index) => (
            <li key={`${col.sampleHeader}-${index}`}>
              <button
                onClick={() => {
                  setShowList(false);
                  props.onChange(col.sampleHeader);
                }}
              >
                {col.sampleHeader}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default AddFilter;
