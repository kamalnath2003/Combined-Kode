import React from 'react'

function Navbar(code) {
    const handleSaveCode = () => {
        const blob = new Blob([code], { type: 'text/java' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      };
  return (
    <nav class="navbar "  style={{backgroundColor:"#e3f2fd"}}>
  <div class="container-fluid">
    <a class="white  navbar-brand" href="#">
      <img src="../favicon.ico" alt="Logo"class="d-inline-block align-text-top" style={{width:"30px",marginRight:"10px"}}/> 
      Kode
    </a>

  </div>
</nav>
  

  )
}

export default Navbar