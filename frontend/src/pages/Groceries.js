import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import emailIcon from '../assets/gmail.png';

const GrocerList = () => {
  const navigate = useNavigate();

  // TODO: Get favorite meals
  const favoriteMeals = [
    {
      name: 'Spaghetti Bolognese',
      ingredients: [
        { name: 'Spaghetti', quantity: 200 },
        { name: 'Ground Beef', quantity: 150 },
        { name: 'Tomato Sauce', quantity: 1 },
        { name: 'Onion', quantity: 1 },
      ],
    },
    {
      name: 'Chicken Salad',
      ingredients: [
        { name: 'Chicken Breast', quantity: 250 },
        { name: 'Lettuce', quantity: 1 },
        { name: 'Tomato', quantity: 2 },
        { name: 'Cucumber', quantity: 1 },
      ],
    },
    {
      name: 'Pancakes',
      ingredients: [
        { name: 'Flour', quantity: 500 },
        { name: 'Eggs', quantity: 3 },
        { name: 'Milk', quantity: 1 },
        { name: 'Baking Powder', quantity: 10 },
      ],
    },
  ];

  const combinedIngredients = favoriteMeals.reduce((acc, meal) => {
    meal.ingredients.forEach(ingredient => {
      const existingIngredient = acc.find(item => item.name === ingredient.name);
      if (existingIngredient) {
        existingIngredient.quantity += ingredient.quantity; // Combine quantities
      } else {
        acc.push({ name: ingredient.name, quantity: ingredient.quantity });
      }
    });
    return acc;
  }, []);

  const handleEmailList = () => {
    // TODO: Logic to email the grocery list
    console.log('Emailing grocery list...');
  };

  return (
    <div className="flex flex-col h-screen font-montserrat bg-custom-white items-center justify-start">
      <div className="flex h-1/5 justify-center mb-2">
        <img src={logo} alt="Logo" className="h-full" />
      </div>
      <div className="flex flex-col w-1/3 p-5">
        <div className="max-h-[60vh] overflow-y-auto border border-gray-300 bg-gray-100 shadow-md font-mono">
          <h1 className="sticky top-0 bg-white p-2 m-0 z-10 text-center font-montserrat font-bold">Grocery List</h1>
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="p-3 border-b border-gray-300 bg-gray-200">ITEM</th>
                <th className="p-3 border-b border-gray-300 bg-gray-200">QTY</th>
              </tr>
            </thead>
            <tbody>
              {combinedIngredients.map((ingredient, index) => (
                <tr key={index}>
                  <td className="p-3 border-b border-gray-300 text-left pl-4">{ingredient.name}</td>
                  <td className="p-3 border-b border-gray-300">{ingredient.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={handleEmailList}
        className="absolute bottom-5 right-5 w-24 h-24 rounded-full bg-custom-red-200 flex items-center justify-center shadow-md hover:bg-custom-red-100 transition-transform duration-300"
      >
        <img src={emailIcon} alt="Email List" className="max-w-[60%] max-h-[60%]" />
      </button>
    </div>
  );
};

export default GrocerList;