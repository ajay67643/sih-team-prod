// import React from 'react';
// import './App.css'; // Keep your CSS import
// // import CameraStream from './CameraStream'; // Import the CameraStream component
// import HandTrackingApp from './HandTrackingApp';

// function App() {
//   return (
//     <div className="App">
//       <HandTrackingApp />
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Update to use Routes instead of Switch
import './App.css'; // Keep your CSS import
import HandTrackingApp from './HandTrackingApp'; // Your existing hand tracking component
import HomePage from './HomePage'; // Assuming you have a HomePage component
import Dictionary from './Dictionary' ;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Updated route syntax */}
          <Route path="/hand-tracking" element={<HandTrackingApp />} />
          <Route path="/dictionary" element={<Dictionary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
