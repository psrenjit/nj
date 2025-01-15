import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container, Modal} from 'react-bootstrap'
import {  useParams } from 'react-router-dom'

export default function InsertNumbers() {
    //const requests = {"id": "","Reqest_no": "","mobNo": "","Provider": "","fdate": "","tdate": "","cdr": "0","CAF": "0","address": "0"}
    const requests = {"Reqest_no": "","mobNo": "","Provider": "","fdate": "","tdate": "","cdr": "0","CAF": "0","address": "0"}
    const[data,setData ]=useState(requests)
    const { id } = useParams()
    const [numbers, setNumbers] = useState([])
    useEffect(() => {
        axios.get(`http://192.168.1.14:8080/api/select-no.php?number=${id}`)
            .then(res => {
                console.log(res)
                setNumbers(res.data.numbersAvailable)
            })
            .catch((error) => {
                console.log(error);
            })
    }, [id])

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
const btnUpdateclick = async (e) => {
        e.preventDefault();
        try{    
        await axios.put("http://192.168.1.14:4000/user/register", data,{
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
           //toastIng(res.data.station)
          })
          .catch((error) => { console.log(error) })
        }
        catch (error1) {
          console.error(`my error is ${error1}`);
        } 
        setShow(false)
       window.location.reload()
      }
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------

    const [show, setShow] = useState(false)
    const [updateshow, setUpdateshow] = useState(false)
    const handleCross = () => setShow(false)
    const handleupdateCross = () => setUpdateshow(false)
    const addbtnclick = async (e) => {
        console.log(data)
        
        e.preventDefault();
        try{    
        await axios.post("http://192.168.1.14:8080/api/insert-no.php", data,{
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            console.log(res)
           //toastIng(res.data.station)
          })
          .catch((error) => { console.log(error) })
        }
        catch (error1) {
          console.error(`my error is ${error1}`);
        } 
        //setShow(false)
      
      }
    const handleaddShow = async (e, rowid) => {
        console.log(rowid)
        setData(rowid)
        console.log(data)
        setUpdateshow(true)
    }
   

    const checked = (chk) => chk !== "0";

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------
    const handleShow = () => {
        console.log();
        setShow(true)
    }

    const formatDate = (dateTime) => {
        const date = new Date(dateTime); // Parse the date string
        const day = String(date.getDate()).padStart(2, "0"); // Get day with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed)
        const year = date.getFullYear(); // Get year
        return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
      };

    const inputHandler = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        console.log(data)
      }

    const inputchkHandler=(e)=>{
        const {name,value}=e.target
        if(value==='on')
            setData({ ...data, [name]: '1' })
        console.log(data.fdate)
    }

    const inputdateHandler=(e)=>{
        const {name,value}=e.target
        const [day, month, year] = value.split("/");
        setData({ ...data, [name]: `${year}-${month}-${day}` })
        console.log(data);
        
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------
    const handleFocustdate = (event) => {
        event.target.max = new Date().toISOString().split("T")[0];
    };

    const handleFocusfdate = (event) => {
        const today = new Date();
        const monthBack = new Date(today.setMonth(today.getMonth() - 24)).toISOString().split("T")[0];
        event.target.min = monthBack;
    };

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <Container>

            {/* ------------------------------------------------------------------------------------------------------------------------------------------------------ */}

            <Modal show={show} backdrop="static" onHide={handleCross} >
                <Modal.Header style={{ justifyContent: 'center', backgroundColor: '#E8E8E8' }} closeButton>
                    <Modal.Title >SAVE</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#E8E8E8' }}>
                    {/* <input type="hidden" name="id" value={data.id} onChange={inputHandler}/> */}
                    <input type="hidden" name="Reqest_no" value={data.Reqest_no} onChange={inputHandler}/>
                    <div className="row2 border border-success border-4" id="insertn">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="mobNo" className="form-label">Number</label>
                                <input type="email" className="form-control" placeholder="Number" id="mobNo" name='mobNo' value={data.mobNo} onChange={inputHandler}/>
                            </div>
                            <div className="col">
                                <label htmlFor="Provider" className="form-label">Service Provider</label>
                                <select className="form-control" aria-label="Default select example" id="Provider" name='Provider' value={data.Provider} onChange={inputHandler}>
                                    <option >Select service provider</option>
                                    <option value="Airtel">Airtel</option>
                                    <option value="VI">VI</option>
                                    <option value="Jio">Jio</option>
                                    <option value="BSNL">BSNL</option>
                                </select>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col">
                                <label htmlFor="fDate" className="form-label">From Date</label>
                                <input type="date" className="form-control" id="fdate" name='fdate' placeholder="From Date" value={data.fdate} onChange={inputdateHandler} />
                            </div>
                            <div className="col">
                                <label htmlFor="tDate" className="form-label">To Date</label>
                                <input type="date" className="form-control" id="tdate" name='tdate' placeholder="To Date" value={data.tdate} onChange={inputdateHandler} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-auto">
                                <div className="form-check">
                                    <input type="checkbox" className="btn-check" id="cdr" name='cdr' checked={checked(data.cdr)} onChange={inputchkHandler}/>
                                    <label className="btn btn-outline-primary" htmlFor="cdr">CDR</label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="form-check">
                                <input type="checkbox" className="btn-check" id="CAF" name='CAF' checked={checked(data.CAF)} onChange={inputchkHandler}/>                                    
                                    <label className="btn btn-outline-primary" htmlFor="CAF">CAF</label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="form-check">
                                    <input type="checkbox" className="btn-check" id="address" name='address' checked={checked(data.address)} onChange={inputchkHandler}/>
                                    <label className="btn btn-outline-primary" htmlFor="address">ADDRESS</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="cbtn btn btn-success mb-3" id="loginform"  onClick={addbtnclick}> SAVE</button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#E8E8E8' }}>
                </Modal.Footer>
            </Modal>

            {/* ------------------------------------------------------------------------------------------------------------------------------------------------------ */}

            <Modal show={updateshow} backdrop="static" onHide={handleupdateCross} >
                <Modal.Header style={{ justifyContent: 'center', backgroundColor: '#E8E8E8' }} closeButton>
                    <Modal.Title >EDIT</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#E8E8E8' }}>
                <input type="hidden" name="id" value={data.id} onChange={inputHandler}/>
                    <input type="hidden" name="Reqest_no" value={data.Reqest_no} onChange={inputHandler}/>
                    <div className="row2 border border-success border-4" id="insertn">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="mobNo" className="form-label">Number</label>
                                <input type="email" className="form-control" placeholder="Number" id="mobNo" name='mobNo' value={data.mobNo} onChange={inputHandler}/>
                            </div>
                            <div className="col">
                                <label htmlFor="Provider" className="form-label">Service Provider</label>
                                <select className="form-control" aria-label="Default select example" id="Provider" name='Provider' value={data.Provider} onChange={inputHandler}>
                                    <option selected>Select service provider</option>
                                    <option value="Airtel">Airtel</option>
                                    <option value="VI">VI</option>
                                    <option value="Jio">Jio</option>
                                    <option value="BSNL">BSNL</option>
                                </select>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col">
                                <label htmlFor="fDate" className="form-label">From Date</label>
                                <input type="date" className="form-control" id="fdate" placeholder="From Date" onFocus={handleFocusfdate} value={data.fdate} onChange={inputHandler} />
                            </div>
                            <div className="col">
                                <label htmlFor="tDate" className="form-label">To Date</label>
                                <input type="date" className="form-control" id="tdate" placeholder="To Date" onFocus={handleFocustdate} value={data.tdate} onChange={inputHandler} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-auto">
                                <div className="form-check">
                                    <input type="checkbox" className="btn-check" id="cdr" name='cdr' checked={data.cdr} onChange={inputHandler}/>
                                    <label className="btn btn-outline-primary" htmlFor="cdr">CDR</label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="form-check">
                                    <input type="checkbox" className="btn-check" id="CAF" name='CAF' checked={data.CAF} onChange={inputHandler}/>
                                    <label className="btn btn-outline-primary" htmlFor="caf">CAF</label>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="form-check">
                                    <input type="checkbox" className="btn-check" id="address" name='address' checked={data.address} onChange={inputHandler}/>
                                    <label className="btn btn-outline-primary" htmlFor="address">ADDRESS</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="cbtn btn btn-success mb-3" id="loginform" onClick={btnUpdateclick} > UPDATE</button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#E8E8E8' }}>
                </Modal.Footer>
            </Modal>

            {/* ------------------------------------------------------------------------------------------------------------------------------------------------------ */}
            <i className="bi bi-cloud-plus" onClick={handleShow}></i>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>REQUEST NO</th>
                        <th>MOB NO</th>
                        <th>PROVIDER</th>
                        <th>FROM DATE</th>
                        <th>TO DATE</th>
                        <th>CDR</th>
                        <th>CAF</th>
                        <th>ADR</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {numbers.map(us => (
                        <tr key={us.id}>
                            <td>{us.Reqest_no}</td>
                            <td>{us.mobNo}</td>
                            <td>{us.Provider}</td>
                            <td>{formatDate(us.fdate)}</td>
                            <td>{formatDate(us.tdate)}</td>
                            <td>{us.cdr}</td>
                            <td>{us.CAF}</td>
                            <td>{us.address}</td>
                            <td><i className="bi bi-pencil-square" onClick={(event) => handleaddShow(event, us)}></i></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}

