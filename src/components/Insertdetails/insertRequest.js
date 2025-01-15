import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import config from '../conf/config';
import { errorToast, successToast } from '../CERTIFIEDCOLLECTED/validate/Validate';

export default function InsertRequest() {
  const navigate = useNavigate(); // Allows navigation between routes
  const requests = { cC: "", rO: "", policeS: "", cN: "", sec: "" }; // Initial state structure for the form
  const [er,setEr]=useState(0)
  const [request, setRequest] = useState(requests); // State to hold form input data

  // Handles changes in form inputs and updates state dynamically
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setRequest({ ...request, [name]: value });
  };

  //
  const inputtHandler = (e) => {
    const { name, value } = e.target;
    const validValue = value.replace(/[^0-9/]/g, "");
    setRequest({ ...request, [name]: validValue });
  };

  // Submits the form data to the server and handles the response
  const handleAdd = async (e) => {
    if (request.rO !== "" && request.policeS !== ""&& request.cN !== ""&& request.cC !== ""&& request.sec !== "") { // Validates required fields
      e.preventDefault();
      console.log(request); // Logs request data for debugging
      await axios.post(`${config.BASE_URL}/savecfc.php`, request, {
        headers: {
          'Content-Type': 'application/json', // Specifies data format
        },
      })
        .then((res) => {
          if (res.data.reqestno) { // Checks for a successful response
           successToast('Data saved as ' + res.data.reqestno || 'Data saved successfully!')
            navigate(`/insertNumber/${res.data.reqestno}`); // Redirects to a new page
          } else {
            errorToast('error occured')
          }
        })
        .catch((error) => { console.error(error); }); // Logs errors to the console
    } else {
      setEr(0) // Alerts the user if required fields are empty
      errorToast('error occured')
    }
  };

  const [req, setReq] = useState([]); // Holds fetched request data
  const [station, setStation] = useState([]); // Holds fetched station data

  // Fetches station and request data when the component loads
  useEffect(() => {
    axios.get(`${config.BASE_URL}/station-edit/station-edit.php`)
      .then(res => {
        console.log(res)
        setStation(res.data.station); // Populates station dropdown
      })
      .catch((error) => {
        errorToast('error in fetching station data') // Logs errors
      });

    axios.get(`${config.BASE_URL}/select-request.php`)
      .then(resd => {
        if(resd.data.Status){
          console.log(resd);
          setReq(resd.data.numbersAvailable);
          const maxCfcNo = Math.max(...resd.data.numbersAvailable.map((usd) => parseInt(usd.cfcNo, 10)), 0);
          setRequest(prevState => ({
            ...prevState,
            cC: maxCfcNo + 1 // Set cC to max + 1
          }));
         // Sets request data for the table
        }
        else
        {
          errorToast('All field is required')
        }
      })
      .catch((error) => {
        errorToast('error occured')
      });
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Container>
      <div>
        {/* Form Section */}
        {er?'': <p style={{ color: "red" }}>{'all field required'}</p>}
        <div className="input-group mb-3">
          <span className="input-group-text col-4 border border-primary custom-bg text-black fw-bold" id="basic-addon1">CFC NUMBER</span>
          <input type="text" className="form-control border border-primary" name="cC" id="cC" value={request.cC} onChange={inputHandler} disabled/>
        </div>
        
        {/* Request Station Dropdown */}
        <div className="input-group mb-3">
          <span className="input-group-text col-4 border border-primary custom-bg text-black fw-bold" id="basic-addon1">Request Station</span>
          <select className="form-control border border-primary" id="rO" name='rO' value={request.rO} onChange={inputHandler} >
            <option value="">Select station</option>
            {station.map((us) => (
              <option key={us.stationId} value={us.stationId}>{us.stationName}</option>
            ))}
          </select>
        </div>

        {/* Other Inputs */}
        {/* Similar dropdown for Police Station */}
        <div className="input-group mb-3">
          <span className="input-group-text col-4 border border-primary custom-bg text-black fw-bold" id="basic-addon1">Police Station</span>
          <select className="form-control border border-primary" id="policeS" name='policeS' value={request.policeS} onChange={inputHandler} >
            <option value="">Select station</option>
            {station.map((us) => (
              <option key={us.stationId} value={us.stationId}>{us.stationName}</option>
            ))}
          </select>
        </div>

        {/* Additional fields for crime number and sections */}
        <div className="input-group mb-3">
          <span className="input-group-text col-4 border border-primary custom-bg text-black fw-bold" id="basic-addon1">Crime NUMBER</span>
          <input type="text" className="form-control border border-primary" name="cN" id="cN" value={request.cN} onChange={inputtHandler} pattern="[0-9/]*" />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text col-4 border border-primary custom-bg text-black fw-bold" id="basic-addon1">Sections</span>
          <input type="text" className="form-control border border-primary" name="sec" id="sec" value={request.sec} onChange={inputHandler} />
        </div>
        <Button variant="primary" onClick={handleAdd}>Save</Button>
      </div>

      {/* Table Section */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Request No</th>
            <th>CFC NO</th>
            <th>REQUESTED BY</th>
            <th>STATION</th>
            <th>CRIME NO</th>
            <th>SECTIONS</th>
            <th>YEAR</th>
            <th>OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {req.map((usd) => (
            <tr key={usd.Reqest_no}>
              <td>{usd.Reqest_no}</td>
              <td>{usd.cfcNo}</td>
              <td>{usd.reqStation}</td>
              <td>{usd.station}</td>
              <td>{usd.crimeNo}</td>
              <td>{usd.Sections}</td>
              <td>{usd.cYear}</td>
              <td>
                <Link to={`/insertNumber/${usd.Reqest_no || 'default'}`}>
                  <i className="bi bi-file-earmark-plus icon-bg"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
