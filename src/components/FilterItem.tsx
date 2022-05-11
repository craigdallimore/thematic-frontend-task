import React from "react";
import { Filter, FilterType, FilterId, ScoreType } from "../types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

interface Props {
  filter: Filter;
  onFilterChanged: (filter: Filter) => void;
  onDelete: (id: FilterId) => void;
}

const FilterItem = (props: Props) => {
  const [showModal, setShowModal] = React.useState(false);
  const [scoreType, setScoreType] = React.useState<ScoreType>(
    props.filter.scoreType ?? "Average"
  );

  return (
    <>
      <li>
        <input
          type="text"
          value={props.filter.name}
          onChange={(e) => {
            props.onFilterChanged({
              ...props.filter,
              name: e.target.value,
            });
          }}
        />
        <select
          value={props.filter.type}
          onChange={(e) => {
            props.onFilterChanged({
              ...props.filter,
              type: e.target.value as FilterType,
            });
          }}
        >
          <option value="Default">Default</option>
          <option value="Data">Data</option>
          <option value="Search">Search</option>
          <option value="Score">Score</option>
        </select>
        {props.filter.type === "Score" && (
          <button
            type="button"
            data-id="btn-score-modal"
            aria-label="Configure score"
            onClick={() => setShowModal(true)}
          ></button>
        )}
        <button
          type="button"
          data-id="btn-delete"
          aria-label="Delete filter"
          onClick={() => props.onDelete(props.filter.id)}
        ></button>
        <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
          <ModalHeader>Edit Filter</ModalHeader>
          <ModalBody data-id="modal-body">
            <select
              value={scoreType}
              onChange={(e) => {
                setScoreType(e.target.value as ScoreType);
              }}
            >
              <option value="Average">Average</option>
              <option value="NPS">NPS</option>
              <option value="Threshold">Threshold</option>
            </select>
            <button
              data-id="btn-cancel-modal"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              data-id="btn-save-modal"
              onClick={() => {
                setShowModal(false);
                props.onFilterChanged({
                  ...props.filter,
                  scoreType,
                });
              }}
            >
              Save
            </button>
          </ModalBody>
        </Modal>
      </li>
    </>
  );
};

export default FilterItem;
