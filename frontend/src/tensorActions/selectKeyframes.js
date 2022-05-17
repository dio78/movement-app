import normalizeKeypoints from "./tensorActions";
import * as poseDetection from '@tensorflow-models/pose-detection';
import React, { useRef, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";

const SelectKeyframes = (props) => {

  const [selectedKeypointArray, setSelectedKeypointArray] = useState([]);
  const imageDetectorRef = useRef(null);
  const canvasRef = useRef(null);

  const movenetLoad = async () => {

    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox,
      multiPoseMaxDimension: 512
    };

    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    imageDetectorRef.current = detector;
  }

  const detect = async (detector, image, canvas) => {
    if (image == null) {
      console.log('false')
      return;
    }

    const pose = await detector.estimatePoses(image);

    

    normalizeKeypoints(pose[0].keypoints, 640, 360.56, image.videoWidth, image.videoHeight)
    debugger;
    setSelectedKeypointArray([...selectedKeypointArray,[pose[0].keypoints]]);
    // drawSkeleton(canvas, pose);
    console.log(selectedKeypointArray)
    debugger;
  }

  const drawSkeleton = (canvas, keypoints) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1500, 1300);

    debugger;
    drawKeypoints(keypoints[0], ctx);
    drawBones(keypoints[0], ctx);
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

  movenetLoad(); 

  const CanvasContainer = () => {
    // selectedKeypointArray.forEach((keypoint) => {
    //   return (
    //   //   <canvas ref={canvasRef}
      
    //   // width='700px'
    //   // height='400px'
      
    //   // style={{
    //   //   width: '25%',
    //   //   zIndex: 4, 
    //   //   borderStyle: 'solid',
    //   //   borderColor: 'blue',
    //   //   borderWidth: '5px'
    //   // }}
    //   // />
    //   <div>
    //     hello
    //   </div>
    //   )
    // })

    const array1 = [1, 2, 3, 4, 5];

    array1.map((element) => {
      return(
        <div>
          {element}
        </div>
      )
    })
  }

  const handleKeyframeClick = (e) => {
    e.preventDefault();
    
    const video = props.otherVidRef.current;
    const canvas = props.selectCanvasRef.current;
    // canvasRef.current.height = canvasRef.current.width * (400/700);
    // const ctx = canvas.getContext('2d')

    // ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    movenetLoad(); 
    detect(imageDetectorRef.current, video, canvasRef.current);

  }

  const CanvasElement = (props) => {
    
    const canvas = useRef();

    debugger;

    React.useEffect(() => {
      const context = canvas.current.getContext('2d');
      context.fillStyle = "rgb(200, 0, 0)";
      context.fillRect(10, 10, 50, 50);

      context.fillStyle = "rgba(0, 0, 200, 0.5)";
      context.fillRect(30, 30, 50, 50);

      drawSkeleton(canvas.current, props.keypoints)
    })
    // if(canvas.current) {
    //   drawSkeleton(canvas.current, [keypoints])
    // }

    return (
      <Col xs={3} className='text-center'>
      <canvas ref={canvas}
      
      width='700px'
      height='400px'
      
      style={{
        display: "inline-block",
        width: '100%',
        zIndex: 4, 
        borderStyle: 'solid',
        borderColor: 'blue',
        borderWidth: '5px',
      }}
      />
      <p>{props.index}</p>
      </Col>
    )

  }

return (
  <>
  <button type="button" onClick={handleKeyframeClick}>Select As Step</button>
  <Container fluid>
  <Row>
    <Col xs={12} className="my-1">
      {/* <canvas ref={canvasRef}
      
      width='700px'
      height='400px'
      
      style={{
        width: '25%',
        zIndex: 4, 
        borderStyle: 'solid',
        borderColor: 'blue',
        borderWidth: '5px'
      }}
      /> */}
      <CanvasContainer />
      <Col xs={{span: 10, offset: 1}} className='mb-5'>
        <Row>
        {selectedKeypointArray.length > 0 && selectedKeypointArray.map((keypointArray, i) => {
          
          const value = {
            index: i + 1
          };
          debugger;

          const keypoints = {
            keypoints: keypointArray
          };

          return(
              <CanvasElement {...keypoints} {...value}/>
              // <canvas key={i}

              // width='700px'
              // height='400px'
              
              // style={{
              //   width: '20%',
              //   display: 'inline', 
              //   zIndex: 4, 
              //   borderStyle: 'solid',
              //   borderColor: 'blue',
              //   borderWidth: '5px',
              //   margin: '10px 5%'
              // }}
              // />
          )
        })}
        </Row>
      </Col>
    </Col>
  </Row>
  </Container>
  </>
)
};

export default SelectKeyframes;