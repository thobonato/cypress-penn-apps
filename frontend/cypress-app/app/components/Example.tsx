'use client';
import React, { useState } from 'react';

const TestButton: React.FC = () => {
  const [responseData, setResponseData] = useState<string | null>(null);

  const test = async () => {
    try {
      const frameData = encodeURIComponent(JSON.stringify({ example: "data" }));
      
      const response = await fetch(`http://localhost:8000/api/stream-feed?frame_data=${frameData}`, {
        method: 'POST',
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
    <div>
      <button 
        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
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

export default TestButton;