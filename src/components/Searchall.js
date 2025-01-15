
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import config from './conf/config';

export default function Searchall() {
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
        `${config.BASE_URL}/signed-request.php?number=${cfc}`
      );
      if (response.data && response.data.user) {
        console.log(response.data.user)
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

  return (
    <Container>
      <div className="input-group mb-3 border border-primary rounded shadow">
        <span className="input-group-text bg-info" id="basic-addon1">
          Enter MOBILE NO
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
        <table className="table table-striped " style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
          <thead>
            <tr>
              <th>CFC NO</th>
              <th>MOB NO</th>
              <th>REQUESTED BY</th>
              <th>STATION</th>
              <th>SIGNED DATE</th>
              <th>REQ COLLECTED BY</th>
              <th>RED COLLECTED ON</th>
              <th>CFC RECIVED ON</th>
              <th>CFC COLLECTED BY</th>
              <th>CFC COLLECTED ON</th>              
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
                <td>{us.requestnosrequestcollectedperson}</td>
                <td>{us.requestnosreqcoldate}</td>
                <td>{us.requestnoscfcreciveddate}</td>
                <td>{us.requestnoscfccollectedperson}</td>
                <td>{us.requestnoscfccoldate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
