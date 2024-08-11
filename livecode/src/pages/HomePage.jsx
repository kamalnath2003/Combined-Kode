import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

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
      <div className="col p-0">


          <button class="button-75" role="button" onClick={createNewSession}>Create New Session</button>
          
            <input
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
            <button className='button-75' onClick={() => {
              joinSession(valuee)
            }}>join</button>


       

      </div>
    </div>

    </div>
    

  );
}

export default HomePage;
