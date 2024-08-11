import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

const Navbar =(props)=> {


  return (<>
  <nav className=" navbar navbar-expand-lg navbar-light"style={{ backgroundColor: '#41b9a5' }}>
  <a className="navbar-brand" href="#"><a className="navbar-brand ms-5" href="/"><img src="/kode.svg" style={{width:"40%"}} alt="" /></a></a>
  <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="navbar-collapse collapse   " style={{marginLeft:'20%'}} id="navbarColor03">

    <ul className="navbar-nav ">

      <li className="nav-item">
       
              <a className="nav-link"   href="https://github.com/kamalnath2003" >          <img style={{width:'40%'}} src="https://img.icons8.com/ios-filled/100/FFFFFF/email.png" alt="email"/></a>
      </li>
      <li className="nav-item">
      <a className="nav-link "   href="https://www.linkedin.com/in/kamalnath-vijayavel-018b00203/" > <img  src="https://img.icons8.com/?size=100&id=8808&format=png&color=FFFFFF" alt="linkedin" style={{width:"40%"}}/></a>

      </li>
      <li className="nav-item">
              <a className="nav-link"   href="https://github.com/kamalnath2003" >             <img style={{width:'80%'}} src="https://img.icons8.com/ios-filled/50/FFFFFF/github.png" alt="github"/></a>
        
      </li>
    </ul>
    
    
    {
      props.page=='editor' &&
    <form className=" ms-auto form-inline d-flex">
      <input className="form-control h-50 mt-2 mr-sm-2"type="text"
              value={props.fileName}
              onChange={props.handleFileNameChange}
              placeholder="Enter file name"  />
      <a className="  "   onClick={props.handleSaveCode} ><img  style={{width:'100%'}} src="https://img.icons8.com/sf-black/64/FFFFFF/download.png" alt="download"/></a>
    </form>
    }
  </div>
</nav>

  


</>
  )
}

export default Navbar
