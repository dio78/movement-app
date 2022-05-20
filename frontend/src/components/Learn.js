import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import LearningSkeleton from "./LearningSkeleton";
import { Row, Col, Container, Button } from "react-bootstrap";
import LearningSkeletonOverlay from "./LearningSkeletonOverlay";

export default function Learn () {
  let [movement, setMovement] = useState({})
  const CanvasRef = useRef(null);
  const runningPlaybackRef = useRef(false);
  let [playbackSpeed, setPlaybackSpeed] = useState(50);
  let [showCanvas, setShowCanvas] = useState(false);
  let [showStepCanvas, setShowStepCanvas] = useState(true);
  const StepCanvasRef = useRef(null);
  const [nose, setNose] = useState(null);


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

      

      const request = axios.get(
        `http://localhost:8000/api/learn/${id}`, headerConfig, { params: { answer: 42 } }
      );

      const { data, status } = await request
      
      if (status === 200) {

        setMovement(data[0]);
        console.log(data);
        
      } else {
        alert('oops')
      }
    } catch(error) {
      console.log(error);
    };
  }

  const drawSteps = () => {

    const drawSkeleton = (pose) => {
      
      const ctx = StepCanvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, 700, 500);
      const keypoints = pose[0][0];
  
      drawKeypoints(keypoints, ctx);
      drawBones(keypoints, ctx);
    }
  
    const drawKeypoints = (keypoints, ctx) => {
      keypoints.forEach(keypoint => {
        if (keypoint.name === 'nose') {
          setNose(keypoint.x);
        }
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


    drawSkeleton(movement.steps)
  }
  
  const runPlayback = (poses, ctx) => {
    let counter = 0;
    runningPlaybackRef.current = true;
    let intervalId = setInterval(() => {
      const maxCount = poses.length - 1;
      if (counter === maxCount) {
        
        runningPlaybackRef.current = false;
        clearInterval(intervalId)
        intervalId = null;
        
        ctx.clearRect(0, 0, 700, 500);
      } else {
        ctx.clearRect(0, 0, 700, 500);
        drawPlaybackKeypoints(counter, poses, ctx);
        drawPlaybackBones(counter, poses, ctx);
        counter++;
      }
    }, 90 - playbackSpeed)
  }

  const drawPlaybackKeypoints = (counter, poses, ctx) => {
    // ctx.clearRect(0, 0, 700, 500);

    const pose = poses[counter];

    pose.forEach(keypoint => {
      if (keypoint.score > 0.1) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2*Math.PI)
        ctx.stroke();
      }
    });
  }

  const drawPlaybackBones = (counter, poses, ctx) => {
    const keypoints = poses[counter];
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

  const drawPlaybackSkeleton = (canvas, poses) => {
    const ctx = canvas.current.getContext('2d');
    if (!runningPlaybackRef.current){
      runPlayback(poses, ctx)
    } else {
      console.log('nice try')
    }    
  }

  const handlePlayClick = async (e) => {
    e.preventDefault();

    const keypointArray = movement.keyframes;

    if (keypointArray.length > 0) {
      console.log('click')
      // const poses = keypointArray.map((x) => {
      //   return x;
      // });
      console.log(typeof keypointArray);
      console.log(keypointArray);
      
      drawPlaybackSkeleton(CanvasRef, keypointArray)
    }
  } 

  return(

    <Container fluid>
    <Row>
      <Col>
      <div>Now Learning: "{movement.title}"  by {movement.username}</div>
      </Col>
    </Row>

    <Row >
      <Col className='text-center'>
        <Row>
          <Col>
          <LearningSkeletonOverlay />
            <canvas  ref={CanvasRef}
              width='640px'
              height='480px'
              style={{
                zIndex: 2, 
                borderStyle: 'solid',
                borderColor: 'green',
                borderWidth: '5px',
                position: 'relative'
              }}/>
          </Col>
        </Row>
        <Button type="button" onClick={handlePlayClick}>Play</Button>
            <div>
              <input type='range' min='10' max='90' step='5' onChange={(e) => setPlaybackSpeed(e.target.value)} style={{'width': '20%'}}/>
              <p>Playback Speed: {playbackSpeed/50}x</p>
            </div>
      </Col>
      {/* <Col xs={6} className='text-center'>
        <LearningSkeleton />
      </Col>  */}
        
    </Row>
    </Container>

  )
}