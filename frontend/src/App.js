// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import MainPage from './MainPage';
// import Profile from './Profile';
// import FoodList from './FoodList';
// import GroceryList from './groceries';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<MainPage />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/food-list" element={<FoodList />} />
//         <Route path="/groceries" element={<GroceryList />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.js';
import LandingPage from './pages/LandingPage.js';
import MealCard from './pages/MealCard/MealCard';
import MealGeneration from './pages/MealGeneration/MealGeneration';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login.js';
import Registration from './pages/Registration.js';
import Groceries from './pages/Groceries/Groceries';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/generate-meals" element={<MealGeneration />} />
        <Route path="/generate-groceries" element={<Groceries />} />
      </Routes>
    </Router>
  );
};

export default App;
