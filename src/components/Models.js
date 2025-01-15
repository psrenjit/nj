import React from 'react';
import { Modal } from 'react-bootstrap';

export default function Modals({ show, handleClose, data, setData, onSave }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: checked ? '1' : '0' }));
  };

  const isChecked = (value) => value === '1';

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{data.Reqest_no ? 'Update' : 'Save'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input
            type="text"
            name="mobNo"
            placeholder="Number"
            value={data.mobNo}
            onChange={handleInputChange}
          />
          {/* Other fields */}
          <button onClick={() => onSave(data)}>Save</button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
