import React from "react";
import { Filter, FilterType, FilterId, ScoreType } from "../types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <Input
          type="text"
          value={props.filter.name}
          onChange={(e) => {
            props.onFilterChanged({
              ...props.filter,
              name: e.target.value,
            });
          }}
        />
        <Label>Type</Label>
        <Input
          type="select"
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
        </Input>
        {props.filter.type === "Score" && (
          <Button
            light="true"
            type="button"
            data-id="btn-score-modal"
            aria-label="Configure score"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon="cog" />
          </Button>
        )}
        <Button
          color="danger"
          type="button"
          data-id="btn-delete"
          aria-label="Delete filter"
          onClick={() => props.onDelete(props.filter.id)}
        >
          <FontAwesomeIcon icon="trash-alt" />
        </Button>
        <Modal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          className="score-modal"
        >
          <ModalHeader>Edit Filter</ModalHeader>
          <ModalBody data-id="modal-body">
            <Input
              type="select"
              value={scoreType}
              onChange={(e) => {
                setScoreType(e.target.value as ScoreType);
              }}
            >
              <option value="Average">Average</option>
              <option value="NPS">NPS</option>
              <option value="Threshold">Threshold</option>
            </Input>
            <footer>
              <Button
                data-id="btn-cancel-modal"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
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
              </Button>
            </footer>
          </ModalBody>
        </Modal>
      </li>
    </>
  );
};

export default FilterItem;
