// app/page.tsx

import React from 'react';
import {BackgroundBeamsWithCollision} from "../components/ui/background-beams-with-collision";
import SignupFormDemo from "../components/ui/signup-form-demo";

export default function Home() {
  return (
    <div>
      <BackgroundBeamsWithCollision>
      <div className="relative flex-col text-center">
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white font-sans tracking-tight">
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-blue-500 via-green-500 to-blue-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span>CypressMFA</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-green-500 via-blue-500 to-green-500 py-4">
              <span>CypressMFA</span>
            </div>
          </div>
        </h2>
        <div className="mt-10 bg-black border-black"><SignupFormDemo/></div>
      </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}


//   return (
//     <div>
//     {/* <BackgroundBeamsWithCollision>
//       <div className="relative flex-col text-center">
//         <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white font-sans tracking-tight">
//           <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
//             <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-blue-500 via-green-500 to-blue-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
//               <span>CypressMFA</span>
//             </div>
//             <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-green-500 via-blue-500 to-green-500 py-4">
//               <span>CypressMFA</span>
//             </div>
//           </div>
//         </h2>
//         <div className="mt-10 bg-black border-black"><SignupFormDemo/></div>
//       </div>
//       </BackgroundBeamsWithCollision> */}
//       <div className='bg-[conic-gradient(from_140deg_at_50%_50%,#3ca33c_20%,#4F86E2_60%,#3ca33c_100%)]'>
//         <div className="min-h-screen flex items-center justify-center">
//           <AuthPage />
//         </div>
//         <div className='text-center text-sm pb-2'>
//           <footer>Made with ❤️ by Akhil, Josh, & Tom. </footer>
//         </div> 
//       </div>
//     </div>
//   );
// }
