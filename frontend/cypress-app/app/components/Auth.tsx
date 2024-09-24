"use client";

import React, { useRef, useState, useEffect } from "react";
import { IconCamera } from "@tabler/icons-react";
import Confetti from 'react-confetti';

type GestureKey = `gesture${1 | 2 | 3}_complete`;

type GesturePass = {
  [key in GestureKey]: boolean;
};

interface ResultData {
  result: {
    spoofing_pass: boolean;
    face_recog_pass: boolean;
    gesture_pass: GesturePass;
    next_random_gesture: string;
    time_left: number;
  };
}

const AuthPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [resultData, setResultData] = useState<ResultData>({
    result: {
      spoofing_pass: false,
      face_recog_pass: false,
      gesture_pass: {
        gesture1_complete: false,
        gesture2_complete: false,
        gesture3_complete: false,
      },
      next_random_gesture: '',
      time_left: 45,
    },
  });
  const [authAccepted, setAuthAccepted] = useState(false);

  useEffect(() => {
    const gesturesCompleted = Object.values(resultData.result.gesture_pass).every(
      (isComplete) => isComplete
    );

    if (gesturesCompleted) {
      if (!authAccepted) {
        setAuthAccepted(true);

        // Send a message to the opener window (content script)
        if (window.opener) {
          window.opener.postMessage('AUTH_SUCCESS', '*');
        } else {
          console.error('window.opener is null');
        }

        // No need to make an API call if backend integration isn't required
      }
    }
  }, [resultData, authAccepted]);

  const toggleCamera = async () => {
    if (!isCameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let apiInterval: NodeJS.Timeout;

    if (isCameraOn && !authAccepted) {
      // Start the timer
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timerInterval);
            clearInterval(apiInterval);
            return 0;
          }
        });
      }, 1000);

      // Start the API calls
      apiInterval = setInterval(() => {
        captureFrameAndCallAPI();
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(apiInterval);
    };
  }, [isCameraOn, authAccepted]);

  useEffect(() => {
    if (timeLeft <= 0 && !authAccepted) {
      setAuthAccepted(false);
      // Optionally handle failed authentication here
    }
  }, [timeLeft, authAccepted]);

  const captureFrameAndCallAPI = async () => {
    if (videoRef.current && canvasRef.current && isCameraOn) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const frameData = canvasRef.current.toDataURL("image/jpeg");

        // Send the frame data to the backend via POST request
        try {
          const response = await fetch(`http://localhost:8000/api/stream-feed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ frame_data: frameData }),
          });
          const data = await response.json();
          setResultData(data);
          // Update timeLeft if the backend provides it
          setTimeLeft(data.result.time_left);
        } catch (error) {
          console.error("Error fetching data from API:", error);
        }
      }
    }
  };

  // Define the gesture numbers as a constant tuple
  const gestureNums = [1, 2, 3] as const;

  // Monitor gesture completion
  useEffect(() => {
    const gesturesCompleted = Object.values(resultData.result.gesture_pass).every(
      (isComplete) => isComplete
    );

    if (gesturesCompleted) {
      if (!authAccepted) {
        setAuthAccepted(true);
        // Place your API call here
        // Example:
        // await fetch('/api/your-endpoint', { method: 'POST', body: JSON.stringify({ authenticated: true }) });
      }
    }
  }, [resultData, authAccepted]);

  return (
    <div>
        {authAccepted && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    <div className="max-w-md w-full mx-auto rounded-xl p-4 md:p-8 shadow-lg shadow-black bg-black relative">
      
      <div className="flex flex-col items-center">

        {/* CypressMFA */}
        <h2 className="text-2xl relative z-20 md:text-xl lg:text-2xl font-bold text-center text-white font-sans tracking-tight">
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-blue-500 via-green-500 to-blue-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span>CypressMFA</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-green-500 via-blue-500 to-green-500 py-4">
              <span>CypressMFA</span>
            </div>
          </div>
        </h2>
        
        {/* Timer */}
        {resultData.result.spoofing_pass ? (
            <div className="text-2xl font-bold text-red-500">Spoofing Detected.</div>
        ) : 
        (
        timeLeft > 0 ? (
            <span>
              <div className="text-2xl font-bold text-white text-center">{timeLeft}</div>
            </span>
        ) : (
            <div className="text-2xl font-bold text-red-500 text-center">Time's up!</div>
        )
        )}

        {/* FaceID Circle */}
        <div className="mt-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400"></div>
            {resultData.result.face_recog_pass && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-green-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* FaceID Result */}
        {!resultData.result.face_recog_pass ? (
            <div className="pt-2 text-md font-bold text-red-500 text-center"> Face not yet recognized. </div>
        ) : (
            <div className="pt-2 text-md font-bold text-green-500 text-center"> Face recognized. </div>
        )
        }
        
        {/* Camera Stream */}
        <div className="mt-4 w-full aspect-video bg-zinc-800 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconCamera className="h-12 w-12 text-neutral-400" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggleCamera}
          className="mt-4 bg-gradient-to-br relative group from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-inset"
        >
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>

        {/* Current Gesture */}
        <div className="mt-4 text-white">
          Current Gesture: {resultData.result.next_random_gesture || "None"}
        </div>

        {/* Gesture Circles */}
        <div className="mt-4 flex space-x-4">
          {gestureNums.map((num) => {
            // num is correctly inferred as 1 | 2 | 3
            const gestureKey: GestureKey = `gesture${num}_complete`;
            const isComplete = resultData.result.gesture_pass[gestureKey];
            return (
              <div key={num} className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-gray-400"></div>
                {isComplete && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-green-500"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width="160"
        height="120"
      />
    </div>
    </div>
  );
};

export default AuthPage;
