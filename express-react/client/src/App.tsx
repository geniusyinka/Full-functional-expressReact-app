// @ts-nocheck

import React, { useState, useEffect } from 'react'
import './App.css';




function App() {
  const [backendData, setBackendData] = useState([{}])
  const [logged, setLogged] = useState('')


  //login

  const onSubmitHandle = (e) => {
    const data = new FormData(e.target)
    e.preventDefault();
    const user = {}

    for (let entry of data.entries()) {
      user[entry[0]] = entry[1]
    }
    fetch('/in', {
      method: 'POST',
      body: data
    })
      .then(res => res.text())
      .then(txt => {
        if (txt == "OK") {
          setLogged('true');
          console.log('logged in!')
        }

        else { alert(txt); }
        console.log(logged)
      })
      .catch(err => console.error(err));
    return false;
  }


  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => {
        setBackendData(data)
      })
  }, [])

  const console1 = () => {
    console.log(backendData)
  }

  // ssx stuff!

  return (
    <div className="App">
      <div className="App-header">
        <div>
          {!logged ?
            <>
              <form onSubmit={onSubmitHandle}>
                <input type="email" name="email" value="jon@doe.com" /> <br />
                <input type="password" name='password' value='111111' />
                <button type='submit'>submit</button>
              </form>
            </>
            :
            <>
              <form method="post" action="/out">
                <button type='submit'>sign out</button>
              </form>
            </>
          }
        </div>
      </div>
    </div>
  );
}




export default App;
