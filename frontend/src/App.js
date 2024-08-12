import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.js';
import LandingPage from './pages/LandingPage.js';
import MealGeneration from './pages/MealGeneration';
import Profile from './pages/Profile.js';
import Login from './pages/Login.js';
import Registration from './pages/Registration.js';
import Groceries from './pages/Groceries.js';
import salad from './assets/salad.jpg';

const App = () => {
  const mealsList = [
    {
      image: salad,
      name: 'Veggie Supreme Salad',
      calories: 150,
      cookTime: 10,
      ingredients: {
        'Lettuce': '2 cups',
        'Tomato': '1 cup',
        'Cucumber': '1 cup',
        'Olive Oil': '2 tbsp',
        'Lemon Juice': '1 tbsp',
        'Salt': 'to taste',
        'Pepper': 'to taste',
      },
      earliestExpirationDate: '2024-08-09',
    },
    {
      image: salad,
      name: 'Veggie Supreme Salad 2',
      calories: 150,
      cookTime: 10,
      ingredients: {
        'Lettuce': '2 cups',
        'Tomato': '1 cup',
        'Cucumber': '1 cup',
        'Olive Oil': '2 tbsp',
        'Lemon Juice': '1 tbsp',
        'Salt': 'to taste',
        'Pepper': 'to taste',
      },
      earliestExpirationDate: '2024-08-10',
    },
    {
      image: salad,
      name: 'Veggie Supreme Salad 3',
      calories: 150,
      cookTime: 10,
      ingredients: {
        'Lettuce': '2 cups',
        'Tomato': '1 cup',
        'Cucumber': '1 cup',
        'Olive Oil': '2 tbsp',
        'Lemon Juice': '1 tbsp',
        'Salt': 'to taste',
        'Pepper': 'to taste',
      },
      earliestExpirationDate: '2024-08-11',
    },
    {
      image: salad,
      name: 'Veggie Supreme Salad 4',
      calories: 150,
      cookTime: 10,
      ingredients: {
        'Lettuce': '2 cups',
        'Tomato': '1 cup',
        'Cucumber': '1 cup',
        'Olive Oil': '2 tbsp',
        'Lemon Juice': '1 tbsp',
        'Salt': 'to taste',
        'Pepper': 'to taste',
      },
      earliestExpirationDate: '2024-08-12',
    },
    {
      image: salad,
      name: 'Veggie Supreme Salad 5',
      calories: 150,
      cookTime: 10,
      ingredients: {
        'Lettuce': '2 cups',
        'Tomato': '1 cup',
        'Cucumber': '1 cup',
        'Olive Oil': '2 tbsp',
        'Lemon Juice': '1 tbsp',
        'Salt': 'to taste',
        'Pepper': 'to taste',
      },
      earliestExpirationDate: '2024-08-13',
    },
    {
      image: salad,
      name: 'Pasta Primavera',
      calories: 300,
      cookTime: 15,
      ingredients: {
        'Pasta': '2 cups',
        'Bell Peppers': '1 cup',
        'Olive Oil': '2 tbsp',
        'Parmesan Cheese': '1/4 cup',
        'Salt': 'to taste',
        'Pepper': 'to taste',
      },
      earliestExpirationDate: '2024-08-14',
    },
    {
      image: salad,
      name: 'Grilled Chicken',
      calories: 400,
      cookTime: 20,
      ingredients: {
        'Chicken Breast': '200g',
        'Olive Oil': '1 tbsp',
        'Garlic': '2 cloves',
        'Salt': 'to taste',
        'Pepper': 'to taste',
      },
      earliestExpirationDate: '2024-08-15',
    },
  ];

  // TODO: Secure routes: must be authenticated before moving on else login again
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/generate-meals" element={<MealGeneration meals={mealsList} />} />
        <Route path="/generate-groceries" element={<Groceries />} />
      </Routes>
    </Router>
  );
};

export default App;