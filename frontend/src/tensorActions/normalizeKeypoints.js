const normalizeKeypoints = (keypoints, imageWidth, imageHeight, intrinsicWidth, intrinsicHeight) => {
  const widthRatio = imageWidth / intrinsicWidth;
  const heightRatio = imageHeight / intrinsicHeight;

  // const updatedKeypoints = keypoints.map((keypoint) => {
  //   keypoint.x = keypoint.x * widthRatio;
  //   keypoint.y = keypoint.y * heightRatio;

  //   return keypoint;
  // })

  // return updatedKeypoints;

  keypoints.forEach(keypoint => {
    keypoint.x = keypoint.x * widthRatio;
    keypoint.y = keypoint.y * heightRatio;
  });
};

export default normalizeKeypoints;