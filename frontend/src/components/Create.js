import { Container, Row, Col, Form } from "react-bootstrap";
import styled from "styled-components";
import { keyframes } from "styled-components";
import { useRef, useState, useEffect } from "react";
import * as poseDetection from '@tensorflow-models/pose-detection';
import normalizeKeypoints from "../tensorActions/normalizeKeypoints";
import SelectKeyframes from "../tensorActions/selectKeyframes";

export default function Create() {

  let [file, setFile] = useState(null);
  let [test, setTest] = useState('');
  let [analyzed, setAnalyzed] = useState(false);
  let [processing, setProcessing] = useState(true);
  let [keypointArray, setKeypointArray] = useState([])
  let otherVidRef = useRef(null);
  const detectorRef = useRef(null);
  const canvasRef = useRef(null);
  const selectCanvasRef = useRef(null);

  const newArray = []

  const handleFileChoose = (e) => {
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setFile(objectUrl);
  }

  const movenetLoad = async () => {

    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox,
      multiPoseMaxDimension: 512
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
    // video.videoHeight = '360px'
    if (video.readyState === 4) {

      const pose = await detector.estimatePoses(video);

      if (!pose[0]) {
        return;
      }
      normalizeKeypoints(pose[0].keypoints, 640, 360.56, otherVidRef.current.videoWidth, otherVidRef.current.videoHeight)

      drawSkeleton(canvasRef, pose);

      if(!analyzed && otherVidRef.current) {
        newArray.push(pose[0].keypoints);
      }
    }
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

  const handleLoaded = (e) => {
    otherVidRef.current.addEventListener("resize", ev => {
      alert('resized!');
    })
    console.log('Width: ' + otherVidRef.current.videoWidth)
    console.log('Height: ' + otherVidRef.current.videoHeight)
    if (analyzed) {
      e.target.controls = true;
      e.target.autoPlay = false;
    } else {
      e.target.controls = false;
      e.target.play();
    }
  }

  const handleVideoEnded = (e) => {
    if (keypointArray.length > 0) {
      return;
    }
    e.target.autoPlay = false;
    setAnalyzed(true);
    setProcessing(false);

    const newArray2 = [...newArray]
    debugger;
    setKeypointArray(newArray2);
  }
 
  
  const VideoUpload = () => {
    if (file) {
      return (
        <StyledVideoUpload ref={otherVidRef} src={file} type='video/mp4' onLoadedMetadata={handleLoaded} onEnded={handleVideoEnded}></ StyledVideoUpload>
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

  const handleDebug = (e) => {
    e.preventDefault();
    debugger;
  }


  

  const pullData = (data) => {

    return data;
  }

  const doIt = (e) => {
    e.preventDefault();

    let data = pullData

  }

  const ProcessingComponent = () => {
    if (processing) {
      return (
        <Row>
          <Col>
            <h1>1. Analyzing Video</h1>
            <Circle />
          </Col>
        </Row>
      )
    } else {
      return null;
    }
  }

  if (!file) {
    movenetLoad();
    return (
      <PreUpload />
    )
  } else {
    return (
      <>
        <Container fluid style={{width: "100%"}}>
        <Row>
          <Col className="text-center">
            <ProcessingComponent />
          </Col>
        </Row>
        <Row>
          <Col xs={6} className="text-center">
            <VideoUpload className="center" />
              <UploadLabel>
              Upload a different video
              <HiddenFileInput type="file" onChange={handleFileChoose} />
            </UploadLabel>
          </Col>
            
          <Col xs={6} className="text-center">
            <canvas ref={canvasRef}
              width='700px'
              height='390px'
              
              style={{
                // display: 'block',
                zIndex: 4, 
                width: '85%',
                borderStyle: 'solid',
                borderColor: 'blue',
                borderWidth: '5px',
                marginTop: '2rem',
                borderRadius: '10px'
              }}/>
          </Col>
        </Row>
        <Col xs={12} className='mb-1'>
          <StyledSelectKeyframes otherVidRef={otherVidRef} selectCanvasRef={selectCanvasRef} setTest={setTest} keypointArray={keypointArray} analyzed={analyzed}/>
        </Col>
        <Row>
          <Col xs={{span:10, offset:1}}>
          </Col>
        </Row>
        {/* <SelectKeyframes otherVidRef={otherVidRef} selectCanvasRef={selectCanvasRef} /> */}
        
        </Container>
      </>
    )
  }

}

const breatheAnimation = keyframes`
 0% {}
 50% {transform: rotate(180deg);}
 100% {transform: rotate(360deg);}
`
const Circle = styled.div`
 height: 20px;
 width: 20px;

 border-radius: 50%;
 content: "";

 display: inline-block;
 border-style: solid;
 border-width: 5px;
 border-radius: 50%;
 border-color: black;
 border-bottom-color: #9292ed;
 animation-name: ${breatheAnimation};
 animation-duration: 2s;
 animation-iteration-count: infinite;
 animation-timing-function: linear;
`

const StyledSelectKeyframes = styled(SelectKeyframes)`
  display: block;
  margin-bottom: 40px;
`

const StyledVideoUpload = styled.video`
display: block;
margin: 2rem auto 0 auto;
width: 85%;
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