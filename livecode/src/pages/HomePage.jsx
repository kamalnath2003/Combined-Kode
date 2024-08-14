import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import '../pages/Homepage.css';

function HomePage() {
  const navigate = useNavigate();
  const [valuee, setvaluee] = useState();

  const createNewSession = () => {
    const sessionId = Math.random().toString(36).substr(2, 9); // Generate a random session ID
    navigate(`/session/${sessionId}`);
  };

  const joinSession = (sessionId) => {
    navigate(`/session/${sessionId}`);
  };

  return (

    <div className="container-fluid p-0">
      
      
          <Navbar></Navbar>
      <div className="row">

    </div>
    <section className="vh-100 gradient-custom">
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
          <div className="card-body p-4 text-center">

            <div className="mb-md-2 mt-md-2 pb-0">

              <h2 className="fw-bold mb-2 shadow-lg text-uppercase"><img src="./kode.svg" alt="" srcset="" /></h2>
              <p className="text-white-50 mb-3">Create or join session !</p>

              <div data-mdb-input-init className="form-outline form-white mb-3">
                <input  className="form-control form-control-lg" 
                type="text"
                placeholder="Enter session ID"
                onChange={(e) => {
                  setvaluee(e.target.value)
  
                }}
  
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    joinSession(e.target.value);
                  }
                }}
                />
                <label className="form-label" htmlFor="typeEmailX">Enter session id</label>
              </div>



              <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5 "  onClick={() => {
              joinSession(valuee)
            }} type="submit">Join Session</button>


              <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5 mx-5 mt-4 " onClick={createNewSession} type="submit">Create new Session</button>

           

            </div>

            <div>
              <p className="mb-0"><a href="#!" className="text-white-50 fw-bold">made by kamal</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>


    </div>
    

  );
}

export default HomePage;
