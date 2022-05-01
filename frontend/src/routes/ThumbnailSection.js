import { Row, Col } from "react-bootstrap";

export default function ThumbnailSection () {

  const videoArray = [];

  const DisplayVideos = () => {
    if (videoArray.length === 0) {
      return (
        <div>
          <h2>There are no videos to show!</h2>
        </div>
      )
    }

    videoArray.forEach((video) => {
      return (
        <Row>
          <Col className="text-center" xs={{span: 6, offset: 3}}>
            <h4>{video.title}</h4>
            <img src={video.thumbnail} alt='Thumbnail of video that is described in title above' onClick={alert('clicked')}></img>
          </Col>
        </Row>
      )
    })

    return(
      <div>hi!</div>
    )
  }

  return (
    <main style={{ padding: "1rem 0" }}>
      <DisplayVideos />
    </main>
  );
} 