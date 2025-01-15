import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../conf/config';

export default function CfcCollected() {
  const [checked, setChecked] = useState({});
  const [cfc, setCfc] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckboxChange = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const inputHandler = (e) => {
    setCfc(e.target.value);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${config.BASE_URL}/signed/signed-request.php?number=${cfc}`
      );
      if (response.data && response.data.user) {
        setNumbers(response.data.user);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear selected checkboxes when data changes
  useEffect(() => {
    setChecked({});
  }, [numbers]);

  const getCheckedIds = () => Object.keys(checked).filter((id) => checked[id])
  const btnSave = async (e) => {
    const data = { "sno": getCheckedIds().join(',') }
    if (!data.sno) {
      return; // Exit early if sno is not provided
    }
    e.preventDefault()
    try {
      await axios.put(`${config.BASE_URL}/cfc-collected/cfc-collected-update.php`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          console.log(res)
          toast.success(res.data.user, {
            icon: '✅',
          });
          //toastIng(res.data.user)
        })
        .catch((error) => {
          toast.error('Something went wrong!', {
            icon: '❌',
          })
        })
    }
    catch (error1) {
      toast.error('Something went wrong!', {
        icon: '❌',
      })
    }
    fetchData()
  }
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
        />
        <button
          className="btn btn-primary"
          type="button"
          id="btnGet"
          onClick={fetchData}
        >
          SEARCH
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">{error}</div>}
      <div>
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
                <td>
                  <input
                    type="checkbox"
                    id={`checkbox-${us.requestnosid}`}
                    checked={!!checked[us.requestnosid]}
                    onChange={() => handleCheckboxChange(us.requestnosid)}
                    disabled={!(us.requestnossigneddate && us.requestnosreqcoldate &&!us.requestnoscfcreciveddate )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {getCheckedIds().length > 0 && (
            <button
              type="submit"
              className="cbtn btn btn-success mb-3"
              id="loginform"
              onClick={btnSave}
            >
              SAVE
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}
