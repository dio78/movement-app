// import './App.css';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';
import { Button, Row, Col, Input } from 'react-bootstrap';



function Skeleton() {

  const [keypointArray, setKeypointArray] = useState([]);
  const [recording, setRecording] = useState(false);
  const counterRef = useRef(0);
  const runningPlaybackRef = useRef(false);
  const detectorRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const camRef = useRef(null);
  const otherVidRef = useRef(null);
  const canvasRef = useRef(null);
  const secondCanvasRef = useRef(null);

  const newArray = [];
  const [imageArray, setImageArray] = useState([]);

  const movenetLoad = async () => {

    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox
    };

    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    detectorRef.current = detector;
  }
  // !!
  // RECORD VIDEO CODE
  // !!
  // const recordVideo = useCallback(() => {
  //   videoRecorderRef.current = new MediaRecorder(camRef.current.stream, {
  //     mimeType: "video/webm",
  //     videoBitsPerSecond : 2500000
  //   });
  
  //   videoRecorderRef.current.addEventListener(
  //     "dataavailable",
  //     handleDataAvailable
  //   );
  //   videoRecorderRef.current.start(10);

  // }, [camRef, recording, videoRecorderRef]);

  // const [recordedChunks, setRecordedChunks] = useState([]);

  // const handleDataAvailable = useCallback(
  //   ({ data }) => {
  //   // debugger;
  //     if (data.size > 0) {
  //       debugger;
  //       setRecordedChunks((prev) => prev.concat(data));
  //     }
  //   },
  //   [setRecordedChunks]
  // );

  // const stopRecordVideo = useCallback(() => {
  //   debugger;
  //   videoRecorderRef.current.stop();
  //   debugger;
  // }, [videoRecorderRef, camRef]);

  useEffect(() => {  
    
    const interval = setInterval(() => {
      // counterRef.current = counterRef.current + 1;
      // console.log(counterRef.current)

        if (detectorRef) {
          detect(detectorRef.current);
        }
    }, 10);

    if (recording) {
      console.log('started recording')
      // recordVideo();
    } else {
      // if (recordedChunks.length > 0) {
      //   debugger;
      //   stopRecordVideo();
      // }
      console.log('stopped recording')
    }

    return () => {
      clearInterval(interval);
    };
  }, [recording, detectorRef.current]);

  useEffect(() => {
    debugger;
  }, [keypointArray])

  const detect = async (detector) => {
    if (camRef.current == null) {
      return;
    }
    
    const video = otherVidRef.current || camRef.current.video;

    const pose = await detector.estimatePoses(video);
    
    debugger;
    drawSkeleton(canvasRef, pose);
    if(recording) {
      newArray.push(pose[0].keypoints);

    }
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
        <h2>Recording!</h2>
      )
    }

    return (
      <h2>Not Recording</h2>
    )
  }

  const handleClick = (e) => {
    console.log('clicking')
    e.preventDefault();
    if (newArray.length > 0) {
      setKeypointArray(newArray);
    }
    setRecording(recording => !recording);
    
  }


  const runPlayback = (poses, ctx) => {
    let counter = 0;
    runningPlaybackRef.current = true;
    let intervalId = setInterval(() => {
      const maxCount = poses.length - 1;
      if (counter === maxCount) {
        debugger;
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
    }, 10)
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

  const handlePlayClick = (e) => {
    e.preventDefault();
    if (keypointArray.length > 0) {
      console.log('click')
      // const poses = keypointArray.map((x) => {
      //   return x;
      // });
      drawPlaybackSkeleton(secondCanvasRef, keypointArray)
    }
  } 
  
  const handleScreenshot = (e) => {
    e.preventDefault();
    const imgSrc = camRef.current.getScreenshot();
    const newArray = [...imageArray, imgSrc]
    setImageArray(newArray)
    console.log(imageArray);
  }
  
  const VideoMaybe = () => {
    if (file) {
      return (
        <video style={{
          width: '640px',
          height: '480px',
          zIndex: 2 }} ref={otherVidRef} src={file} type='video/mp4' controls></video>
      )
    } else {
      return (
        <img src='https://cdn.mos.cms.futurecdn.net/JYEXpJURGks76oHVBc5cik.jpg'></img>
      )
    }
  }

  const [file, setFile] = useState();
  const handleFileChoose = (e) => {
    debugger;
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setFile(objectUrl);

    debugger;
  }

  return (
    <div>
    <Row className='mt-5' >
      <Col xs={{ span: 5, offset: 1 }} classname='offset-1'>
        <Webcam ref={camRef}

        style={{
          width: '640px',
          height: '480px',
          zIndex: 2
        }}/>

        <canvas className='offset-1' ref={canvasRef}
        width='640px'
        height='480px'
        style={{
          position: 'absolute',
          zIndex: 2, 
          left: 0,
          borderStyle: 'solid',
          borderColor: 'red',
          borderWidth: '5px'
        }}/>
      </Col>
      <Col xs={{ span: 5, offset: 1 }}>
      <canvas ref={secondCanvasRef}
        width='640px'
        height='480px'
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          zIndex: 4, 
          borderStyle: 'solid',
          borderColor: 'red',
          borderWidth: '5px'
        }}/>
      </Col>
    </Row>
    <Row classname='mt-1'>
      <Col xs={6} className='text-center'>
        <Button type='button' onClick={handleClick}>Record</Button>
        <RecordStatus />
      </Col>
      <Col xs={6} className='text-center'>
        <Button style={{marginLeft: '20px'}} type='button' onClick={handlePlayClick}>Play Back</Button>
      </Col>
      
      
    </Row>
    <Row>
    <Col xs={{span: 2, offset: 5}} className='text-center'>
        <Button style={{marginLeft: '20px'}} type='button' onClick={handleScreenshot}>Capture</Button>
      </Col>
    </Row>
    <input type="file" onChange={handleFileChoose}/>
    <VideoMaybe/>
    </div>
  );
}

export default Skeleton;