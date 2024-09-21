'use client';
import React, { useState } from 'react';

const TestButton: React.FC = () => {
  const [responseData, setResponseData] = useState<string | null>(null);

  const test = async () => {
    try {
      const frameData = encodeURIComponent(JSON.stringify({ example: "data" }));
      
      const response = await fetch(`http://localhost:8000/api/stream-feed?frame_data=${frameData}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setResponseData(JSON.stringify({ error: error }, null, 2));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <button 
        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={test}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          Test Button
        </span>
      </button>
      
      {responseData && (
        <pre className="mt-4 p-4 bg-gray-800 text-green-400 rounded-lg overflow-auto max-w-full">
          {responseData}
        </pre>
      )}
    </div>
  );
};

export default TestButton;