// import './App.css';
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';




function Skeleton() {

  const [keypointArray, setKeypointArray] = useState([]);
  const [recording, setRecording] = useState(false);
  const camRef = useRef(null);
  const canvasRef = useRef(null);
  const secondCanvasRef = useRef(null);

  const newArray = [];

  const movenetLoad = async () => {

    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox
    };

    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    
    setInterval(() => {
      detect(detector)
    }, 10)
  }

  const detect = async (detector) => {
    if (camRef.current == null) {
      return;
    }

    const video = camRef.current.video;
    const pose = await detector.estimatePoses(video);
    // console.log(pose);
    drawSkeleton(canvasRef, pose);
    if(recording) {
      newArray.push(pose[0].keypoints);
    }
    // console.log(record)
  }

  const drawSkeleton = (canvas, pose) => {
    const ctx = canvas.current.getContext('2d');
    ctx.clearRect(0, 0, 700, 500);
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

  movenetLoad();

  const RecordStatus = () => {
    if (recording) {
      return (
        <span>Recording!</span>
      )
    }

    return (
      <span>Not Recording</span>
    )
  }

  useEffect( () => {
    console.log(recording);
}, [recording]);

  const handleClick = (e) => {
    console.log('clicking')
    e.preventDefault();
    
    if (recording) {
      setRecording(false);
      setKeypointArray(newArray);
      console.log(keypointArray);
      console.log('stopped recording')
    } else if (!recording) {
      setRecording(true)
      console.log('started recording')
    }
  }

  const drawPlaybackKeypoints = (poses, ctx) => {

    let counter = 0;

    setInterval(() => {
      ctx.clearRect(0, 0, 700, 500);
      poses[counter].forEach(keypoint => {
        if (keypoint.score > 0.1) {
          debugger;
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2*Math.PI)
          ctx.stroke();
        }
      });
      counter++;
      // console.log(counter);
    }, 100)
  }
  const drawPlaybackSkeleton = (canvas, poses) => {
    const ctx = canvas.current.getContext('2d');
    debugger
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 150, 75);
    // ctx.beginPath();
    // ctx.arc(nose.x, nose.y, 5, 0, 2*Math.PI)
    // ctx.stroke();
    // ctx.moveTo(0, 50);
    // ctx.lineTo(300, 50);
    // ctx.stroke();
    debugger;
    drawPlaybackKeypoints(poses, ctx);
    // drawBones(keypoints, ctx);
  }

  const handlePlayClick = (e) => {
    e.preventDefault();
    if (keypointArray.length > 0) {
      console.log('click')
      const poses = keypointArray;
      drawPlaybackSkeleton(secondCanvasRef, poses)
    }
  } 

  return (
    <div className="App">
      <Webcam ref={camRef}
        width='700'
        height='550'
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          position: 'absolute',
          width: '700px',
          height: '500px',
          zIndex: 4, 
          textAlign: 'center',
          left: 0,
          right: 65,
          top: 40
        }}/>
      <canvas ref={canvasRef}
        width='700'
        height='500'
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '700px',
          height: '500px',
          zIndex: 4, 
          textAlign: 'center',
          left: 0,
          right: 0,
          top: 40,
          borderStyle: 'solid',
          borderColor: 'red',
          borderWidth: '10px'
        }}/>
        <canvas ref={secondCanvasRef}
        width='700'
        height='500'
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '700px',
          height: '500px',
          zIndex: 4, 
          textAlign: 'center',
          left: 0,
          right: 0,
          top: 400,
          borderStyle: 'solid',
          borderColor: 'red',
          borderWidth: '10px'
        }}/>
        <button type='button' onClick={handleClick}>Record</button>
        <RecordStatus />
        <button type='button' onClick={handlePlayClick}>Play</button>
    </div>
  );
}

export default Skeleton;