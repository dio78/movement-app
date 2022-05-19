import { Col } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import AddIcon from '@mui/icons-material/Add';
import { saveLibraryVid } from "../actions/actions";

export default function ThumbnailSection () {

  const [movementArray, setMovementArray] = useState([]);

  useEffect(()=> {
    getVideos();
  },[])

  const getVideos = async () => {
    
    try {
      const headerConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'Content-Type': 'application/json',
        },
      };

      const request = axios.get(
        `http://localhost:8000/api/movements/`, headerConfig
      );

      const { data, status } = await request
      
      if (status === 200) {

        setMovementArray(data);
        console.log(data);
        debugger;
      } else {
        alert('oops')
      }
    } catch(error) {
      console.log(error);
    };
  }

  const DisplayVideos = () => {
    if (movementArray.length === 0) {
      return (
        <div>
          <h2>There are no videos to show!</h2>
        </div>
      )
    }
  }

  const handleAdd = (e) => {
    e.preventDefault();

    debugger
    const movement_id = parseInt(e.target.id)

    const body = {
      user_id: JSON.parse(localStorage.currentUser).user_id,
      movement_id: movement_id
    };

    saveLibraryVid(body);

    debugger;
  }

  return (
    <main style={{ padding: "1rem 0" }}>
      <DisplayVideos />
      {movementArray.length > 0 && movementArray.map((movement, i) => {
        debugger;
        return(
          <Col key={i} xs={{span: 6, offset: 2}} className='mb-5'>
             <UsernameDisplay>{movement.username}</UsernameDisplay>
            <PhotoContainer>
              <ThumbnailImage src={movement.thumbnail} alt='Thumbnail of video that is described in title above' onClick={() => alert('clicked')}></ThumbnailImage>
              {/* <TitleLabel>{movement.title}</TitleLabel> */}
              <AddButton onClick={handleAdd} id={movement.movement_id}>
                <AddIcon id={movement.movement_id}/>
                Add
              </AddButton>
            </PhotoContainer>
          </Col>
        )
      })}
    </main>
  );
} 

const ThumbnailImage = styled.img`
  border-radius: 10px;
  width: 100%;
`

const UsernameDisplay = styled.h5`
  font-weight: bold;
`

const TitleLabel = styled.h2`
`

const AddButton = styled.button`
position: absolute;
display: inline-flex;
top: 93%;
left: 93%;
transform: translate(-50%, -50%);
-ms-transform: translate(-50%, -50%);
background-color: #6DCB6B;
color: #FFFFFF;
font-size: 16px;
font-weight: bold;
padding: 6px 10px 6px 5px;
border: none;
cursor: pointer;
border-radius: 5px;

&:hover{
  background-color: #62B761;
}
`

const PhotoContainer = styled.div`
  position: relative;
`