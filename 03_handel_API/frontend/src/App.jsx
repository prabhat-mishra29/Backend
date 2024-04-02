import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const [products,setProducts]=useState([]);
  const [error,setError]=useState(false); //For error
  const [loading,setLoading]=useState(false); //For loading state
  const [search,setSearch]=useState(""); //For inputfield

  //Jese hii component mount hai API call hoke dataSet hojaye.
  /*
    useEffect(()=>{
      axios.get(`/api/products`)    
        .then( (response)=>{
          //No need to convert it to json,it automatically handel by 'axios'.
          console.log(response.data)

          setProducts(response.data) //To get data
        } )
        .catch((error)=>{
          console.log(error)
        })
    },[]);
  */

  //Suppose karo ki hmme interviewer nee bola kii hmee '.then' method use nahi karna hai.
  //Mujhe pure programe ko halt karna hai taki rukk jaye programe,pehle data axios se akee products pai set uske badd kamm hoo.["use of async and await in useEffect"]
  /*
    //Wrong way:-
      useEffect(async()=>{
        const response = await axios.get(`/api/products`)
      },[]);

    //Solution:-IIFE
  */

  /*
    //IIFE "immediately invoked function expression":-[woh function jo turant hii call hojaye]
      //()() :-> 1st paranthesis for defination/callbak and 2nd paranthesis for calling.
      useEffect(()=>{
        //Starting ; :-> for safety purpose we use this.
        ;( async()=>{

          try {
            setError(false);
            setLoading(true);

            const response = await axios.get(`/api/products`); 
            //[Kya matlab hai hamesa response ayega.Agar products ki jagah pai agar producted daal diya toh.Issilye try-catch use karenge.]

            console.log(response.data);
  
            setLoading(false);

            setProducts(response.data) //To get data

          } catch (error) {
            setError(true);
            setLoading(false);
          }

          } )()
      },[]);
  */

  //if any changes happen to 'search' then restart the component.
  //But this will create 'race-condition'.
  //Jo request pehle gayi hai uska data pehle ayaa,jo 2nd gaya woh 2nd ayee,latest joo request gaya uska data sabse end main ayaa taki user ko hmm updated data show kare.
  //Solution:- [using axios controller]

  /*
    //Canceling a fetch request or remove race-condition:-
      //Steps:-
        1.make controller.
        2.send controller.signal.
        3.handel request cancel of axios.
        4.un-mount controller.
  */

    useEffect(()=>{
      //1
      const controller=new AbortController()

      ;( async()=>{

        try {
          setError(false);
          setLoading(true);

          //Now it is time for input field:-
          //const response = await axios.get(`/api/products?search=`+search);
          //Agar search kuch nahi hai toh 5 products show hoga,agar hai toh kuch show hoga.

          //2
          const response = await axios.get(`/api/products?search=`+search, {
            signal:controller.signal
          });
          //get ke sath v 'controller' ko send karna padega.

          console.log(response.data);

          setLoading(false);

          setProducts(response.data) //To get data

        } catch (error) {
          //3
          if(axios.isCancel(error)){
            console.log('Request canceled',error.message);
            return;
          }
          setError(true);
          setLoading(false);
        }

        } )()


        //4
          //clean up method:-[un-mount]
          //The useEffect cleanup function helps developers clean effects that prevent unwanted behaviors, thereby optimizing application performance.
          //However, it is important to note that the useEffect cleanup function does not only run when our component wants to unmount — it also runs right before the execution of the next scheduled effect.
          return()=>{
            controller.abort()
          }
    },[search]);

    
/*
  if(error){
    return(
      <>
        <h1>Something went wrong</h1>
      </>
    );
  }
  else if(loading){
    return(
      <>
        <h1>Loading...</h1>
      </>
    );
  }
  else{
    return (
      <>
        <h1>Chai aur handel API</h1>
        <h2>Number of products are:{products.length}</h2>
      </>
    )
  }
*/


//Using conditional rendering:-
  return(
    <>
      <h1>Chai aur handel API</h1>

      <input type="text" placeholder='Search'
      value={search}
      onChange={(e)=>setSearch(e.target.value)}

      />

      {loading && (<h2>Loading...</h2>)}
      {/* Agar loading hai toh show karo */}

      {error && (<h2>Something went wrong.</h2>)}
      {/* Agar Error hai toh show karo */}

      {products.length!=0 && (<h2>Number of products are:{products.length}</h2>)}
      {/* Agar products hai toh show karo */}
    </>
  );
}
export default App

/*
//React query:-
  React Query is a JavaScript library designed to simplify the complex task of data fetching and caching in React applications. 

    //How to install react-query:-
      npm i @tanstack/react-query

    //Example:-
      import {
        QueryClient,
        QueryClientProvider,
        useQuery,
      } from '@tanstack/react-query'

      const queryClient = new QueryClient()

      export default function App() {
        return (
          <QueryClientProvider client={queryClient}>
            <Example />
          </QueryClientProvider>
        )
      }

      function Example() {
        const { isLoading, error, data } = useQuery({
          queryKey: ['repoData'],
          queryFn: () =>
            fetch('https://api.github.com/repos/TanStack/query').then((res) =>
              res.json(),
            ),
        })

        if (isLoading) return 'Loading...'

        if (error) return 'An error has occurred: ' + error.message

        return (
          <div>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <strong>👀 {data.subscribers_count}</strong>{' '}
            <strong>✨ {data.stargazers_count}</strong>{' '}
            <strong>🍴 {data.forks_count}</strong>
          </div>
        )
      }
*/