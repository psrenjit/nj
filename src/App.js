import InsertRequest from './components/Insertdetails/insertRequest';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Nav from './components/Nav';
import { Toaster } from 'react-hot-toast';
import { Container } from 'react-bootstrap';
import CertifiedCollected from './components/CERTIFIEDCOLLECTED/CertifiedCollected';
import InserNumber from './components/Insertdetails/InserNumber';
import RequestCollected from './components/RequestCollected/RequestCollected';
import CfcCollected from './components/CfcCollected/CfcCollected';
import SignedRequest from './components/updatesinged/SignedRequest';
import RequestLetter from './generate files/Generate';
import Searchall from './components/Searchall';

function App() {
  return (
    <div>
      <Container>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<InsertRequest />} />
            <Route path="/insertNumber/:id" element={<InserNumber />} />
            <Route path="/signed" element={<SignedRequest />} />
            <Route path="/request" element={<RequestCollected />} />
            <Route path="/cfc" element={<CfcCollected />} />
            <Route path="/certified" element={<CertifiedCollected />} />
            <Route path="*" element={<div>Page not found</div>} />
            <Route path="/print/:id" element={<RequestLetter/>}/>
            <Route path="/Search" element={<Searchall/>}/>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </Container>
    </div>
  );
}

export default App;
