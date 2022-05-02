import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";

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
        alert('nice!')
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

    videoArray.map((video, i) => {
      return (
        <Col key={i} className="text-center" xs={{span: 6, offset: 3}}>
          <h4>{video.title}</h4>
          {/* <img src={video.thumbnail} alt='Thumbnail of video that is described in title above' onClick={alert('clicked')}></img> */}
        </Col>
      );
    })
  }

  return (
    <main style={{ padding: "1rem 0" }}>
      <DisplayVideos />
      {videoArray.length > 0 && videoArray.map((video, i) => {
        return(
          <Col key={i} xs={{span: 6, offset: 1}}>
            <h4 onClick={() => console.log('click')}>{video.title}</h4>
            <h5>{video.description}</h5>
            {/* <img src={video.thumbnail} alt='Thumbnail of video that is described in title above' onClick={alert('clicked')}></img> */}
          </Col>
        )
      })}
    </main>
  );
} 