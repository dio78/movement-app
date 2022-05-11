import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { useRef, useState, useEffect } from "react";
import * as poseDetection from '@tensorflow-models/pose-detection';

export default function Create() {

  let [file, setFile] = useState(null);
  let otherVidRef = useRef(null);
  const detectorRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChoose = (e) => {
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setFile(objectUrl);
    alert('Changed!')
  }

  const movenetLoad = async () => {

    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox
    };

    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    detectorRef.current = detector;
  }

  useEffect(() => {  
    
    const interval = setInterval(() => {
        if (detectorRef && otherVidRef.current) {
          
          detect(detectorRef.current);
        }
    }, 10);

    // if (recording) {
    //   console.log('started recording')
    //   // recordVideo();
    // } else {
    //   // if (recordedChunks.length > 0) {
    //   //   debugger;
    //   //   stopRecordVideo();
    //   // }
    //   console.log('stopped recording')
    // }

    return () => {
      clearInterval(interval);
    };
  }, [detectorRef.current]);

  const detect = async (detector) => {
    if (otherVidRef.current == null) {
      console.log('false')
      return;
    }

    const video = otherVidRef.current;

    const pose = await detector.estimatePoses(video);
    
    
    drawSkeleton(canvasRef, pose);
  }

  const drawSkeleton = (canvas, pose) => {
    const ctx = canvas.current.getContext('2d');
    ctx.clearRect(0, 0, 1500, 1300);
    const keypoints = pose[0].keypoints;

    drawKeypoints(keypoints, ctx);
    drawBones(keypoints, ctx);
  }

  const drawKeypoints = (keypoints, ctx) => {
    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.1) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2*Math.PI)
        ctx.stroke();
      }
    });
  }

  const drawBones = (keypoints, ctx) => {
    const [nose, leftEye, rightEye, leftEar, rightEar, leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle] = keypoints;

    const pairs = [[leftEye, rightEye], [leftShoulder, rightShoulder], [leftShoulder, leftElbow], [rightShoulder, rightElbow], [leftElbow, leftWrist], [rightElbow, rightWrist], [leftShoulder, rightShoulder], [leftShoulder, leftHip], [rightShoulder, rightHip], [leftHip, rightHip], [leftHip, leftKnee], [rightHip, rightKnee], [leftKnee, leftAnkle], [rightKnee, rightAnkle]]

    pairs.forEach((pair) => {
      if (pair[0].score > 0.1 && pair[1].score > 0.1) {
        ctx.moveTo(pair[0].x, pair[0].y);
        ctx.lineTo(pair[1].x, pair[1].y);
        ctx.stroke();
      }
    })
    
  }

  
  const VideoUpload = () => {
    if (file) {
      debugger;
      return (
        <StyledVideoUpload controls ref={otherVidRef} src={file} type='video/mp4' autoPlay></ StyledVideoUpload>
      )
    } else {
      return null;
    }
  }

  const PreUpload = () => {
    return(
      <Container>
        <Row>
          <Col xs={{span: 6, offset: 3}} className="text-center mt-5 mb-5">
            <Quote><em>“Life is like riding a bicycle. To keep your balance you must keep moving.”</em><br />-Albert Einstein </Quote>
          </Col>
        </Row>
        <Row>
        <Col xs={{span: 6, offset: 3}} className="text-center mt-5">
          <div>
            <strong>Share your movement with the world</strong>
          </div>
          <UploadLabel>
            Upload a video
            <HiddenFileInput type="file" onChange={handleFileChoose} />
          </UploadLabel>
          </Col>
        </Row>
      </Container>
    )
  }

  if (!file) {
    movenetLoad();
    return (
      <PreUpload />
    )
  } else {
    return (
      <>
        <Container fluid style={{width: "100%"}} className="text-center">
          <VideoUpload className="center" />
          <UploadLabel>
          Upload a different video
          <HiddenFileInput type="file" onChange={handleFileChoose} />
        </UploadLabel>
        <Col xs={{span:10, offset:1}}>
          <canvas ref={canvasRef}
            width='700px'
            height='400px'
            
            style={{
              zIndex: 4, 
              borderStyle: 'solid',
              borderColor: 'green',
              borderWidth: '5px'
            }}/>
        </Col>
        
        </Container>
      </>
    )
  }

}

const StyledVideoUpload = styled.video`
display: block;
margin: 2rem auto 0 auto;
width: 40rem;
height: auto;
border-radius: 10px;
`

const Quote = styled.span`
  font-size: 1rem
`

const UploadLabel = styled.label`
margin: 1rem;
background-color: #3A36E7;
border-radius: 5px;
color: #FFFFFF;
border: none;
padding: 5px 5px;

&:hover {
  background-color: #2B28B2;
}
`

const HiddenFileInput = styled.input`
  display: none;
`