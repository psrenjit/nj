
import React, { useEffect, useState } from 'react'
import { Container, Modal } from 'react-bootstrap'
import axios from 'axios'
import { checkboxCheck, dateChecking, numberproviderCheck } from '../Mytest'
import { Link, useParams } from 'react-router-dom'
import config from '../conf/config'
import { errorToast, successToast } from '../CERTIFIEDCOLLECTED/validate/Validate'

export default function InserNumber() {

    /*======================================================================================================================*/
    const { id } = useParams()
    const [numbers, setNumbers] = useState([])
    const fetchData = async () => {
        try {
          const response = await axios.get(`${config.BASE_URL}/select-no.php?number=${id}`);
          if (response.data && response.data.numbersAvailable) {
            setNumbers(response.data.numbersAvailable);
          } 
        } catch (err) {
            errorToast('failed to get data')
        } 
      };
    
      // Fetch data on page load
      useEffect(() => {
        fetchData();
      }, [id],fetchData);
    /*======================================================================================================================*/

    const [ushow, setUshow] = useState(false)
    const handleuCross = () => {setUshow(false)}
    const urequests = {"id":"","Reqest_no": id,"mobNo": "","Provider": "","fdate": "","tdate": "","cdr": "0","CAF": "0","address": "0"}
    const[usdata,setUsdata ]=useState(urequests)

    const inputuHandler = (e) => {
        const { name, value } = e.target
        setUsdata({ ...usdata, [name]: value })
        console.log(data)
      }
      const inputuchkHandler=(e)=>{
        const { name, checked } = e.target; // Destructure 'name' and 'checked' from the event
        setUsdata({ ...usdata,[name]: checked ? '1' : '0'});
    }
    const btnUpdate = async (e) => {
        console.log(usdata)        
        if (!numberproviderCheck(usdata)) {
            alert("Please fill all required fields.");
            return; 
        }

        if (!checkboxCheck(usdata)) {
            alert("select atleast one item");
            return; 
        }
        if (usdata.cdr==="1") {
            if (!dateChecking(usdata)) {
                alert("date not valid");
                return;
            }
        }
        console.log(usdata)        
        e.preventDefault()
        try{    
        await axios.post(`${config.BASE_URL}/update-no.php`, usdata,{
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            console.log(res)
           //toastIng(res.usdata.station)
          })
          .catch((error) => { 
            console.log(error) })
        }
        catch (error1) {
          console.error(`my error is ${error1}`);
        } 
        fetchData()   
        setUshow(false)   
      }
      const handleaddShow = async (e, rowid) => {        
        setUsdata(rowid)  
        console.log(usdata);
        setUshow(true)
              
    }
    /*======================================================================================================================*/

    const [show, setShow] = useState(false)
    const handleCross = () => {
        setData(requests)
        console.log(data)
        
        setShow(false)}
    const requests = {"Reqest_no": id,"mobNo": "","Provider": "","fdate": "","tdate": "","cdr": "0","CAF": "0","address": "0"}
    const[data,setData ]=useState(requests)
    const inputHandler = (e) => {
        const { name, value } = e.target
        if (name === 'mobNo') {
            if (/^\d{0,10}$/.test(value)) {
                setData({ ...data, [name]: value })
            }
        }
        else {
            setData({ ...data, [name]: value })
        }
        console.log(data)
    }
      const inputchkHandler=(e)=>{
        const { name, checked } = e.target; // Destructure 'name' and 'checked' from the event
        setData({ ...data,[name]: checked ? '1' : '0'});
    }
    
    const checked = (chk) => chk !== "0";

    const handleShow = () => {
        setShow(true)
    }
    const btnSave = async (e) => {
        console.log(data)
        
        if (!numberproviderCheck(data)) {
            alert("Please fill all required fields.");
            return; 
        }

        if (!checkboxCheck(data)) {
            alert("select atleast one item");
            return; 
        }
        if (data.cdr==="1") {
            if (!dateChecking(data)) {
                alert("date not valid");
                return;
            }
        }

        console.log(data)        
        e.preventDefault()
        try{    
        await axios.post(`${config.BASE_URL}/insert-no.php`, data,{
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            console.log(res)
            successToast('Successfully inserted')
          })
          .catch((error) => { 
            errorToast('failed to insert') 
        })
        }
        catch (error1) {
            errorToast('failed to insert')
        } 
        fetchData()
        setShow(false)      
      }
  return (
    <div>
        
        <Modal show={show} backdrop="static" onHide={handleCross} >
    <Modal.Header style={{ justifyContent: 'center', backgroundColor: '#E8E8E8' }} closeButton>
        <Modal.Title >SAVE</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ backgroundColor: '#E8E8E8' }}>
        
        
        <div className="row2 border border-info border-2" id="insertn">
            <div className="row">
                <div className="col">
                    <label htmlFor="mobNo" className="form-label">Number</label>
                    <input type="number" className="form-control" placeholder="Number" id="mobNo" name='mobNo' value={data.mobNo} onChange={inputHandler}/>
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
                    <input type="date" className="form-control" id="fdate" name='fdate' placeholder="From Date" value={data.fdate} onChange={inputHandler} />
                </div>
                <div className="col">
                    <label htmlFor="tDate" className="form-label">To Date</label>
                    <input type="date" className="form-control" id="tdate" name='tdate' placeholder="To Date" value={data.tdate} onChange={inputHandler} />
                </div>
            </div>
            <div className="row py-4">
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
                <button type="submit" className="cbtn btn btn-success mb-3 w-100" id="loginform" onClick={btnSave}  > SAVE</button>
            </div>
        </div>
    </Modal.Body>
    <Modal.Footer style={{ backgroundColor: '#E8E8E8' }}>
    </Modal.Footer>
</Modal>

{/*==============================================test2==============================================*/}
<Modal show={ushow} backdrop="static" onHide={handleuCross} >
    <Modal.Header style={{ justifyContent: 'center', backgroundColor: '#E8E8E8' }} closeButton>
        <Modal.Title >UPDATE</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ backgroundColor: '#E8E8E8' }}>
        <input type="hidden" name="id" value={usdata.id} />
        <input type="hidden" name="Reqest_no" value={usdata.Reqest_no} />
        <div className="row2 border border-info border-2" id="insertn">
            <div className="row">
                <div className="col">
                    <label htmlFor="mobNo" className="form-label">Number</label>
                    <input type="email" className="form-control" placeholder="Number" id="mobNo" name='mobNo' value={usdata.mobNo} onChange={inputuHandler}/>
                </div>
                <div className="col">
                    <label htmlFor="Provider" className="form-label">Service Provider</label>
                    <select className="form-control" aria-label="Default select example" id="Provider" name='Provider' value={usdata.Provider} onChange={inputuHandler}>
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
                    <label htmlFor="ufDate" className="form-label">From Date</label>
                    <input type="date" className="form-control" id="ufdate" name='fdate' placeholder="From Date" value={usdata.fdate} onChange={inputuHandler} />
                </div>
                <div className="col">
                    <label htmlFor="utDate" className="form-label">To Date</label>
                    <input type="date" className="form-control" id="utdate" name='tdate' placeholder="To Date" value={usdata.tdate} onChange={inputuHandler} />
                </div>
            </div>
            <div className="row py-4">
                <div className="col-auto">
                    <div className="form-check">
                        <input type="checkbox" className="btn-check" id="ucdr" name='cdr' checked={checked(usdata.cdr)} onChange={inputuchkHandler}/>
                        <label className="btn btn-outline-primary" htmlFor="ucdr">CDR</label>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="form-check">
                    <input type="checkbox" className="btn-check" id="uCAF" name='CAF' checked={checked(usdata.CAF)} onChange={inputuchkHandler}/>                                    
                        <label className="btn btn-outline-primary" htmlFor="uCAF">CAF</label>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="form-check">
                        <input type="checkbox" className="btn-check" id="uaddress" name='address' checked={checked(usdata.address)} onChange={inputuchkHandler}/>
                        <label className="btn btn-outline-primary" htmlFor="uaddress">ADDRESS</label>
                    </div>
                </div>
            </div>
            <div className="col-auto">
                <button type="submit" className="cbtn btn btn-success mb-3 w-100" id="loginform" onClick={btnUpdate}  >UPDATE</button>
            </div>
        </div>
    </Modal.Body>
    <Modal.Footer style={{ backgroundColor: '#E8E8E8' }}>
    </Modal.Footer>
</Modal>

{/*=======================================================================================================*/}

<Container>
<i className="bi bi-cloud-plus text-danger fs-3" onClick={handleShow}></i>
<div className='border border-primary'>
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
                <tbody className="table-group-divider">
                    {numbers.map(us => (
                        <tr key={us.id}>
                            <td>{us.Reqest_no}</td>
                            <td>{us.mobNo}</td>
                            <td>{us.Provider}</td>
                            <td>{us.fdate}</td>
                            <td>{us.tdate}</td>
                            <td>{us.cdr}</td>
                            <td>{us.CAF}</td>
                            <td>{us.address}</td>
                            <td><i className="bi bi-pencil-square icon-bg" onClick={(event) => handleaddShow(event, us)}></i></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <Link to={`/print/${id || 'default'}`} className='btn btn-primary'>
                  Print CFC
                </Link>
            </Container>
</div>
  )
}

