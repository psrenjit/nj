import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../conf/config';

export default function CertifiedCollected() {
  const [checked, setChecked] = useState({});
  const [cfc, setCfc] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [pName, setPName] = useState(''); // New state for the input field
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckboxChange = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const inputHandler = (e) => {
    setCfc(e.target.value);
  };

  const handlePNameChange = (e) => {
    setPName(e.target.value); // Update pName state
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${config.BASE_URL}/signed/signed-request.php?number=${cfc}`
      );
      if (response.data && response.data.user) {
        console.log(response);
        setNumbers(response.data.user);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setChecked({});
  }, [numbers]);

  const getCheckedIds = () => Object.keys(checked).filter((id) => checked[id]);

  const btnSave = async (e) => {
    e.preventDefault();
    const data = {
      sno: getCheckedIds().join(','),
      pName, // Include pName in the request payload
    };
    if (!data.sno&&!data.pName) {
      return; // Exit early if sno is not provided
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `${config.BASE_URL}/cfc-collected-person/cfc-collected-person-update.php`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      toast.success(response.data.user || 'Data saved successfully!', {
        icon: '✅',
      });
      fetchData(); // Refresh the table after saving
    } catch (error) {
      toast.error('Failed to save data. Please try again.', {
        icon: '❌',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="input-group mb-3 border border-primary rounded shadow">
        <span className="input-group-text bg-info" id="basic-addon1">
          Enter CFC No
        </span>
        <input
          type="text"
          className="form-control"
          name="cfcNo"
          value={cfc}
          onChange={inputHandler}
          disabled={loading} // Disable input when loading
        />
        <button
          className="btn btn-primary"
          type="button"
          id="btnGet"
          onClick={fetchData}
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Loading...' : 'SEARCH'}
        </button>
      </div>
      {error && <div className="text-danger">{error}</div>}
      <div className='table-responsive'>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>CFC NO</th>
              <th>MOB NO</th>
              <th>REQUESTED BY</th>
              <th>STATION</th>
              <th>SIGNED DATE</th>
              <th>REQUEST COLLECTED</th>
              <th>CFC RECIVED</th>
              <th>CERIFIED DATE</th>
              <th>CHECK</th>
            </tr>
          </thead>
          <tbody>
            {numbers.map((us) => (
              <tr key={us.requestnosid}>
                <td>{us.CFC_No}</td>
                <td>{us.requestnosmobNo}</td>
                <td>{us.stationName}</td>
                <td>{us.Station}</td>
                <td>{us.requestnossigneddate}</td>
                <td>{us.requestnosreqcoldate}</td>
                <td>{us.requestnoscfcreciveddate}</td>
                <td>{us.requestnoscfccoldate}</td>
                <td>
                  <input
                    type="checkbox"
                    id={`checkbox-${us.requestnosid}`}
                    checked={!!checked[us.requestnosid]}
                    disabled={!(us.requestnossigneddate && us.requestnosreqcoldate && us.requestnoscfcreciveddate && !us.requestnoscfccoldate)} // Enable only if signeddate is true and requestnossigneddate is false
                    onChange={() => handleCheckboxChange(us.requestnosid)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {getCheckedIds().length > 0 && (
            <div class="input-group mb-3">
              <input
                type="text"
                className="form-control"
                name="pName"
                id="pName"
                value={pName}
                onChange={handlePNameChange}
                placeholder="Enter Name"
              />
              <button
                type="submit"
                className="btn btn-success btn-outline-secondary w-25"
                id="loginform"
                onClick={btnSave}
                disabled={loading} // Disable button when loading
                style={{ color: '#fff', fontWeight: 'bold' }}
              >
                {loading ? 'Saving...' : 'SAVE'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
