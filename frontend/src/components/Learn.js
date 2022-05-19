import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";

export default function Learn () {
  let [movement, setMovement] = useState({})


  let { id } = useParams();

  useEffect(()=> {
    getMovement();
  },[])

  const getMovement = async () => {
    
    try {
      const headerConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'Content-Type': 'application/json',
        },
      };

      const body = {
        id
      }

      debugger;

      const request = axios.get(
        `http://localhost:8000/api/learn/`, headerConfig
      );

      const { data, status } = await request
      
      if (status === 200) {

        setMovement({data});
        console.log(data);
        debugger;
      } else {
        alert('oops')
      }
    } catch(error) {
      console.log(error);
    };
  }
  

  return(
    <div>{id}</div>
  )
}