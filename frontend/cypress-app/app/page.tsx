import React from 'react';
import Example from './components/Example';

export default function Home() {
  return (
    <div className="bg-black">
        <p>hello le diddler</p>
        {/* api call to test fastapi */}
        <Example/>
        {/*  */}
    </div>
  );
}
