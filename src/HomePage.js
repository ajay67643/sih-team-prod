
import './HomePage.css';

// function HomePage() {
//   const navigate = useNavigate(); // Hook to navigate programmatically

//   const navigateToHandTracking = () => {
//     navigate('/hand-tracking'); // Navigate to the /hand-tracking route
//   };
//   const navigateToDictionary = () => {
//     navigate('/dictionary'); // Navigate to the /hand-tracking route
//   };

//   return (
//     <div className="HomePage">
//       <h1>Welcome to the Home Screen</h1>
//       <button onClick={navigateToHandTracking} className="toggle-btn">
//         Go to Hand Tracking
//       </button>
//       <button 
//   onClick={() => window.location.href = 'https://aboutvivek.netlify.app/#services'} 
//   className="toggle-btn"
// >
//   Go to Dictionary
// </button>
//     </div>
//   );
// }

// export default HomePage;

// HomePage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timer to navigate after 5 seconds
    const timer = setTimeout(() => {
      navigate('/hand-tracking'); // Navigate to the HandTrackingApp component
    }, 5000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className='hpm'>
    <div className="🤚">
      <div className="👉"></div>
      <div className="👉"></div>
      <div className="👉"></div>
      <div className="👉"></div>
      <div className="🌴"></div>    
      <div className="👍"></div>
    </div>
    </div>
  );
};

export default HomePage;


