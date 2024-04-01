import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  //Now we learn how to fetch data from backend.

  const [jokes,setJokes]=useState([]);

  //We can give API_request using the fetch method, AXIOS, and React-query.
  /*
    >Here we are using 'axios' , for that we have to install 'axios' package.
    >It has more additional feature than fetch method.It is made for handeling web-request.
    >Learn about 'axios'.
  */

/*
  //When application loads we get our jokes:-
  useEffect(()=>{
    //How fetch data or how to send request to the backend.
    axios.get(`http://localhost:3000/jokes`)      
      .then( (response)=>{
        //No need to convert it to json,it automatically handel by 'axios'.
        setJokes(response.data) //To get data
      } )
      .catch((error)=>{
        console.log(error)
      })
  },[]);
*/

/*
  //NOte:-
    >After reloading site we will see in console that it gives you a 'CORS' error.

    >" Access to XMLHttpRequest at 'http://localhost:3000/jokes' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. "

    >What does that mean?
    >'CORS' error means origion is different.
    >url,port everything must be same for everyone.
    >It provides safety to application. 
    >Cross-origin resource sharing (CORS) is a browser mechanism which enables controlled access to resources located outside of a given domain.

    //Solution:-
      1.Go to server/backend , make whitelist of ip-address or domain or port or URL etc .[check index.js]

      2.Use "proxy".
        >How to add proxy:-
          -using create react app:-
            To tell the development server to proxy any unknown requests to your API server in development, add a proxy field to your package.json, for example: "proxy": "http://localhost:3000",
          
          -using vite:-
            Example:
              export default defineConfig({
                server: {
                  proxy:{
                    '/api':'http://localhost:3000',
                  },
                },
              })
              -> Automatically detect karr lega ki jabb v hmm '/api' pai kissi v port number se request kare toh woh 'http://localhost:3000' ko '/api' ke piche append karr lega.
              -> Naki sirf append hoga , proxy laga dijayega ki harr ek url 'localhost:3000' se arrah hai.Server ko lagega ki sabka origin 'http://localhost:3000' se hua hai.
*/

//After updating url to standard form:-
useEffect(()=>{
  //axios.get(`http://localhost:3000/api/jokes`)  
    //But this url is not make any sense.
    //Ho sakta ki abb hmm localhost:3000 serve karr rahe hain hmara url alag v ho sakta hai.

  axios.get(`/api/jokes`)  
  //But this url does not exist write now, so we "proxy" here.
  //A proxy server is a system or router that provides a gateway between users and the internet. Therefore, it helps prevent cyber attackers from entering a private network.
  
  .then( (response)=>{
    //No need to convert it to json,it automatically handel by 'axios'.
    setJokes(response.data) //To get data
  } )
  .catch((error)=>{
    console.log(error)
  })
},[]);


  return (
    <>
      <h1>Chai aur full stack</h1>
      <p>JOKES:{jokes.length}</p>

      {/* Open a javaScript and loop jokes */}
      {/* When ever we use a loop we need a key for optimization.Here joke.id is our key. */}
      {
        jokes.map( (joke)=>(
            <div key={joke.id}>
              <h3>{joke.title}</h3>
              <p>{joke.content}</p>
            </div>
        ))
      }
    </>
  )
}

export default App
