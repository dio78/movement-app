import { Col } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import AddIcon from '@mui/icons-material/Add';

export default function ThumbnailSection () {

  const [videoArray, setVideoArray] = useState([]);

  useEffect(()=> {
    getVideos();
  },[])

  const getVideos = async () => {
    
    try {
      const request = axios.get(
        `http://localhost:8000/api/movements/`
      );

      const { data, status } = await request
      
      if (status === 200) {
        setVideoArray(data);
        console.log(data);
      } else {
        alert('oops')
      }
    } catch(error) {
      console.log(error);
    };
  }

  const DisplayVideos = () => {
    if (videoArray.length === 0) {
      return (
        <div>
          <h2>There are no videos to show!</h2>
        </div>
      )
    }
  }

  return (
    <main style={{ padding: "1rem 0" }}>
      <DisplayVideos />
      {videoArray.length > 0 && videoArray.map((video, i) => {
        debugger;
        return(
          <Col key={i} xs={{span: 6, offset: 2}} className='mb-5'>
             <UsernameDisplay>{video.firstname}</UsernameDisplay>
            <PhotoContainer>
              <ThumbnailImage src={video.thumbnail} alt='Thumbnail of video that is described in title above' onClick={() => alert('clicked')}></ThumbnailImage>
              <AddButton>
                <AddIcon/>
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
`

const UsernameDisplay = styled.h5`
  font-weight: bold;
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