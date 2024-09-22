"use client";

import React, { useRef, useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "../../lib/utils";
import { IconCamera } from "@tabler/icons-react";

const VideoStreamingDashboard = ({ onFrameCapture, onUserIdChange }: { 
  onFrameCapture: (frameData: string) => void,
  onUserIdChange: (userId: string) => void 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [userId, setUserId] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUserId = e.target.value;
    setUserId(newUserId);
    onUserIdChange(newUserId);
  };

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
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    }
  };

  const captureFrame = (): void => {
    if (videoRef.current && canvasRef.current && isCameraOn) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.scale(-1, 1);
        context.drawImage(videoRef.current, -canvasRef.current.width, 0, canvasRef.current.width, canvasRef.current.height);
        context.scale(-1, 1);
        const frameData = canvasRef.current.toDataURL('image/jpeg');
        onFrameCapture(frameData);
      }
    } else {
      console.error('Camera is not on or video element is not available');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-xl p-4 md:pt-8 md:px-8 md:pb-0 shadow-lg shadow-black bg-black">
      <form className="my-1" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Input
            id="username"
            placeholder="Enter your chrome extension id"
            type="text"
            value={userId}
            onChange={handleUserIdChange}
          />
        </LabelInputContainer>

        <div>
          <Label htmlFor="camera">Camera</Label>
          <div className="mt-2 relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center">
                <IconCamera className="h-12 w-12 text-neutral-400" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleCamera}
            className="mt-4 bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
            <BottomGradient />
          </button>
          <button
            type="button"
            onClick={captureFrame}
            className="mt-4 bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            Capture Face
            <BottomGradient />
          </button>
        </div>
      </form>
      <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
    </div>
  );
};

const TestButton = ({ frameData, userId }: { frameData: string, userId: string }) => {
  const [responseData, setResponseData] = useState<string | null>(null);

  const test = async () => {
    if (!frameData) {
      console.error('No frame captured');
      setResponseData(JSON.stringify({ error: "No frame captured" }, null, 2));
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/send-db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frame_data: frameData, username: userId }),
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      setResponseData(JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error('Error:', error);
      setResponseData(JSON.stringify({ error: String(error) }, null, 2));
    }
  };

  return (
    <div>
      <button 
        className="my-6 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={test}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#178117_0%,#4F86E2_50%,#178117_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-3 text-sm font-medium text-white backdrop-blur-3xl">
          Save User
        </span>
      </button>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const CombinedComponent = () => {
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  const handleFrameCapture = (frameData: string) => {
    setCapturedFrame(frameData);
  };

  const handleUserIdChange = (newUserId: string) => {
    setUserId(newUserId);
  };

  return (
    <div>
      <VideoStreamingDashboard onFrameCapture={handleFrameCapture} onUserIdChange={handleUserIdChange} />
      <div className="mt-4">
        <TestButton frameData={capturedFrame || ''} userId={userId} />
      </div>
    </div>
  );
};

export default CombinedComponent;