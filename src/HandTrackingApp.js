// import React, { useEffect, useRef, useState } from 'react';
// import { Hands } from '@mediapipe/hands';
// import { Camera } from '@mediapipe/camera_utils';
// import './HomePage.css';

// const HandTrackingApp = () => {
//   const videoRef = useRef(null); // Video ref to display the camera feed
//   const [landmarks, setLandmarks] = useState([]);
//   const [prediction, setPrediction] = useState(null);

//   useEffect(() => {
//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     });

//     hands.setOptions({
//       maxNumHands: 2,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.5,
//     });

//     // This function is triggered when results are available from MediaPipe
//     hands.onResults((results) => {
//       const leftHand = [];
//       const rightHand = [];
//       let x_ = [];
//       let y_ = [];

//       if (results.multiHandLandmarks) {
//         // Iterate over detected hands
//         results.multiHandLandmarks.forEach((handLandmarks, handIdx) => {
//           // Collect all x and y coordinates for normalization
//           handLandmarks.forEach((landmark) => {
//             x_.push(landmark.x);
//             y_.push(landmark.y);
//           });

//           // Normalize landmarks
//           const landmarksNormalized = [];
//           handLandmarks.forEach((landmark) => {
//             const normalizedX = landmark.x - Math.min(...x_);
//             const normalizedY = landmark.y - Math.min(...y_);
//             landmarksNormalized.push(normalizedX);
//             landmarksNormalized.push(normalizedY);
//           });

//           // Classify hand (left or right)
//           const handLabel = results.multiHandedness[handIdx].label;
//           if (handLabel === 'Left') {
//             leftHand.push(...landmarksNormalized);
//           } else {
//             rightHand.push(...landmarksNormalized);
//           }
//         });
//       }

//       // If no hand detected, fill with zeros (42 zeros for each hand)
//       if (leftHand.length === 0) {
//         leftHand.push(...Array(42).fill(0)); // 42 coordinates for left hand
//       }
//       if (rightHand.length === 0) {
//         rightHand.push(...Array(42).fill(0)); // 42 coordinates for right hand
//       }

//       // Combine both hands' landmarks (left + right)
//       const dataAux = [...leftHand, ...rightHand];
//       setLandmarks(dataAux);

//       // Send data to the API
//       sendLandmarksToAPI(dataAux);
//     });

//     const camera = new Camera(videoRef.current, {
//       onFrame: async () => {
//         // Check if videoRef is correctly set
//         if (videoRef.current) {
//           await hands.send({ image: videoRef.current });
//         } else {
//           console.error('Video reference not found.');
//         }
//       },
//       width: 640,
//       height: 480,
//     });

//     camera.start();

//     // Cleanup function
//     return () => {
//       hands.close();
//       camera.stop();
//     };
//   }, []);

//   // Function to send landmarks to the API
//   const sendLandmarksToAPI = async (landmarks) => {
//     try {
//       const response = await fetch('http://127.0.0.1:8000/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           landmarks: landmarks, // Send the combined landmarks for both hands (84 total)
//         }),
//       });

//       const result = await response.json();

//       // Ensure result contains the necessary data and confidence is greater than 80%
//       if (result && result.predicted_character && result.confidence >= 0.6) {
//         setPrediction(result); // Only set prediction if confidence is >= 80%
//       } else {
//         setPrediction(null); // Don't show prediction if confidence is below 80%
//       }
//     } catch (error) {
//       console.error('Error posting landmarks:', error);
//     }
//   };

//   return (
//     <div className='hpm'>
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       {/* Video element to display the webcam feed */}
//       <video ref={videoRef} style={{ width: '640px', height: '480px' }} autoPlay />
      
//       {/* Display the predicted character and confidence if confidence >= 80% */}
//       {prediction && (
//         <div style={{ marginTop: '20px', textAlign: 'center' }}>
//           <h3>Prediction:</h3>
//           <p>Predicted Character: {prediction.predicted_character}</p>
//           <p>Confidence: {prediction.confidence}</p>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// };

// export default HandTrackingApp;


// import React, { useEffect, useRef, useState } from 'react';
// import { Hands } from '@mediapipe/hands';
// import { Camera } from '@mediapipe/camera_utils';
// import './HomePage.css';

// const HandTrackingApp = () => {
//   const videoRef = useRef(null);
//   const [landmarks, setLandmarks] = useState([]);
//   const [predictionsArray, setPredictionsArray] = useState([]); // Array to store predictions
//   const [sequenceDetected, setSequenceDetected] = useState(null); // Store detected sequence

//   useEffect(() => {
//     const hands = new Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     });

//     hands.setOptions({
//       maxNumHands: 2,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.5,
//     });

//     hands.onResults((results) => {
//       const leftHand = [];
//       const rightHand = [];
//       let x_ = [];
//       let y_ = [];

//       if (results.multiHandLandmarks) {
//         results.multiHandLandmarks.forEach((handLandmarks, handIdx) => {
//           handLandmarks.forEach((landmark) => {
//             x_.push(landmark.x);
//             y_.push(landmark.y);
//           });

//           const landmarksNormalized = [];
//           handLandmarks.forEach((landmark) => {
//             const normalizedX = landmark.x - Math.min(...x_);
//             const normalizedY = landmark.y - Math.min(...y_);
//             landmarksNormalized.push(normalizedX, normalizedY);
//           });

//           const handLabel = results.multiHandedness[handIdx].label;
//           if (handLabel === 'Left') leftHand.push(...landmarksNormalized);
//           else rightHand.push(...landmarksNormalized);
//         });
//       }

//       if (leftHand.length === 0) leftHand.push(...Array(42).fill(0));
//       if (rightHand.length === 0) rightHand.push(...Array(42).fill(0));

//       const dataAux = [...leftHand, ...rightHand];
//       setLandmarks(dataAux);
//       sendLandmarksToAPI(dataAux);
//     });

//     const camera = new Camera(videoRef.current, {
//       onFrame: async () => {
//         if (videoRef.current) await hands.send({ image: videoRef.current });
//       },
//       width: 640,
//       height: 480,
//     });

//     camera.start();

//     return () => {
//       hands.close();
//       camera.stop();
//     };
//   }, []);

//   const sendLandmarksToAPI = async (landmarks) => {
//     try {
//       const response = await fetch('http://127.0.0.1:8000/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ landmarks }),
//       });

//       const result = await response.json();
//       if (result && result.predicted_character && result.confidence >= 0.6) {
//         updatePredictionsArray(result.predicted_character);
//       }
//     } catch (error) {
//       console.error('Error posting landmarks:', error);
//     }
//   };

//   const updatePredictionsArray = (character) => {
//     setPredictionsArray((prev) => {
//       const newPredictions = [...prev, character].slice(-12); // Keep only the last 12 predictions
//       checkForSequence(newPredictions);
//       return newPredictions;
//     });
//   };


//   const playSound = (name) => {
//     // Map the name to the corresponding sound file
//     const soundMap = {
//       green : 'Audio/green.mp3',
//       hate : 'Audio/hate.mp3',
//       i: 'Audio/i.mp3',
//       love : 'Audio/love.mp3',
//       varanasi : 'Audio/varanasi.mp3',
//       you : 'Audio/you.mp3',

//       // Add more mappings as needed
//       // XYZ_Sequence: 'sounds/xyz_sequence.mp3',
//     };
  
//     // Get the sound file path based on the name
//     const soundFile = soundMap[name];
  
//     if (soundFile) {
//       const audio = new Audio(soundFile); // Create an audio instance
//       audio.play(); // Play the audio
//     } else {
//       console.error(`No sound file found for "${name}"`);
//     }
//   };
//   const checkForSequence = (predictions) => {
//     const sequence12 = ['hate-1', 'hate-2']; // Example
//     const sequence3 = ['X', 'Y', 'Z']; // Example

//     if (predictions.join('').includes(sequence12.join(''))) {
//       setSequenceDetected('Sequence of 12 detected: Hate');
//       playSound('hate')
//       console.log('hate');
//     } else if (predictions.slice(-3).join('') === sequence3.join('')) {
//       setSequenceDetected('Sequence of 3 detected: XYZ');
//     } else {
//       setSequenceDetected(null);
//     }
//   };

//   return (
//     <div className='hpm'>
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <video ref={videoRef} style={{ width: '640px', height: '480px' }} autoPlay />
//         {sequenceDetected && (
//           <div style={{ marginTop: '20px', textAlign: 'center' }}>
//             <h3>Sequence Detected:</h3>
//             <p>{sequenceDetected}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HandTrackingApp;


import React, { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import './HomePage.css';

const HandTrackingApp = () => {
  const videoRef = useRef(null);
  const [landmarks, setLandmarks] = useState([]);
  const [predictionsArray, setPredictionsArray] = useState([]);
  const [sequenceDetected, setSequenceDetected] = useState(null);
  const [lastPlayedSound, setLastPlayedSound] = useState(null); // Track last played sound

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const leftHand = [];
      const rightHand = [];
      let x_ = [];
      let y_ = [];

      if (results.multiHandLandmarks) {
        results.multiHandLandmarks.forEach((handLandmarks, handIdx) => {
          handLandmarks.forEach((landmark) => {
            x_.push(landmark.x);
            y_.push(landmark.y);
          });

          const landmarksNormalized = [];
          handLandmarks.forEach((landmark) => {
            const normalizedX = landmark.x - Math.min(...x_);
            const normalizedY = landmark.y - Math.min(...y_);
            landmarksNormalized.push(normalizedX, normalizedY);
          });

          const handLabel = results.multiHandedness[handIdx].label;
          if (handLabel === 'Left') leftHand.push(...landmarksNormalized);
          else rightHand.push(...landmarksNormalized);
        });
      }

      if (leftHand.length === 0) leftHand.push(...Array(42).fill(0));
      if (rightHand.length === 0) rightHand.push(...Array(42).fill(0));

      const dataAux = [...leftHand, ...rightHand];
      setLandmarks(dataAux);
      sendLandmarksToAPI(dataAux);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      hands.close();
      camera.stop();
    };
  }, []);

  const sendLandmarksToAPI = async (landmarks) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarks }),
      });

      const result = await response.json();
      if (result && result.predicted_character && result.confidence >= 0.6) {
        updatePredictionsArray(result.predicted_character);
      }
    } catch (error) {
      console.error('Error posting landmarks:', error);
    }
  };

  const updatePredictionsArray = (character) => {
    setPredictionsArray((prev) => {
      const newPredictions = [...prev, character].slice(-12);
      checkForSequence(newPredictions);
      return newPredictions;
    });
  };

  const playSound = (name) => {
    const soundMap = {
      green: 'Audio/green.mp3',
      hate: 'Audio/hate.mp3',
      i: 'Audio/i.mp3',
      love: 'Audio/love.mp3',
      varanasi: 'Audio/varanasi.mp3',
      you: 'Audio/you.mp3',
    };

    const soundFile = soundMap[name];

    if (soundFile && lastPlayedSound !== name) {
      const audio = new Audio(soundFile);
      audio.play();
      setLastPlayedSound(name); // Update last played sound
    }
  };

  const checkForSequence = (predictions) => {
    const sequence12 = ['hate-1', 'hate-2'];
    const sequence3 = ['varanasi-1', 'varanasi-2'];
    const sequence01 = ['green-1','green-2'];
    const sequence02 = ['love-1','love-2'];
    const sequence03 = ['you-1','you-2'];
    const sequence04 = ['i-1','i-2'];



    if (predictions.join('').includes(sequence12.join(''))) {
      if (sequenceDetected !== 'Sequence of 12 detected: Hate') {
        setSequenceDetected('Sequence of 12 detected: Hate');
        playSound('hate');
        console.log('hate');
      }
    } else if (predictions.slice(-3).join('') === sequence3.join('')) {
      if (sequenceDetected !== 'Sequence of 3 detected: varanasi') {
        setSequenceDetected('Sequence of 3 detected: varanasi');
        playSound('varanasi');
      }
    }else if (predictions.slice(-3).join('') === sequence01.join('')) {
      if (sequenceDetected !== 'Sequence of 3 detected: green') {
        setSequenceDetected('Sequence of 3 detected: green');
        playSound('green');
      }
    }else if (predictions.slice(-3).join('') === sequence02.join('')) {
      if (sequenceDetected !== 'Sequence of 3 detected: love') {
        setSequenceDetected('Sequence of 3 detected: love');
        playSound('love');
      }
    }else if (predictions.slice(-3).join('') === sequence03.join('')) {
      if (sequenceDetected !== 'Sequence of 3 detected: you') {
        setSequenceDetected('Sequence of 3 detected: you');
        playSound('you');
      }
    } else if (predictions.slice(-3).join('') === sequence04.join('')) {
      if (sequenceDetected !== 'Sequence of 3 detected: i') {
        setSequenceDetected('Sequence of 3 detected: i');
        playSound('i');
      }
    }else {
      setSequenceDetected(null);
      setLastPlayedSound(null); // Reset last played sound if sequence breaks
    }
  };

  return (
    <div className='hpm'>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <video ref={videoRef} style={{ width: '640px', height: '480px' }} autoPlay />
        {sequenceDetected && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3>Sequence Detected:</h3>
            <p>{sequenceDetected}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandTrackingApp;
