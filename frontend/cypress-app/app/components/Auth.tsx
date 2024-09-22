"use client";

import React, { useRef, useState, useEffect } from "react";
import { IconCamera } from "@tabler/icons-react";

// Define GestureKey using template literal types
type GestureKey = `gesture${1 | 2 | 3}_complete`;

// Define GesturePass as a type with keys of GestureKey
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
      time_left: 15,
    },
  });

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

    if (isCameraOn) {
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
  }, [isCameraOn]);

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

  return (
    <div className="max-w-md w-full mx-auto rounded-xl p-4 md:p-8 shadow-lg shadow-black bg-black">
      <div className="flex flex-col items-center">
        {/* Timer */}
        <div className="text-2xl font-bold text-white">{timeLeft}</div>

        {/* Cypress Auth */}
        <div className="text-xl font-bold text-white mt-2">Cypress Auth</div>

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
          <BottomGradient />
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
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
    </>
  );
};

export default AuthPage;