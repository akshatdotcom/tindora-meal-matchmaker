import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import receipt from '../assets/receipt.png';
import tomato from '../assets/tomato.png';
import grocery from '../assets/grocery.png';
import meal from '../assets/meal.png';
import profile from '../assets/user.png';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [currentMeals, setCurrentMeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    buyDate: '',
    expirationDate: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchedIngredients = await getIngredients();
      const fetchedMeals = await getCurrentMeals();
      setIngredients(fetchedIngredients);
      setCurrentMeals(fetchedMeals);
    };

    fetchData();
  }, []);

  const getIngredients = async () => {
    // TODO: Fetch ingredients from the database
    const ingredients = [
      { id: 1, name: 'Tomato', quantity: '2 kg', buyDate: '2024-06-01', expirationDate: '2024-06-10' },
      { id: 2, name: 'Onions', quantity: '1 kg', buyDate: '2024-06-02', expirationDate: '2024-06-12' },
      { id: 3, name: 'Chicken Breast', quantity: '500 g', buyDate: '2024-06-03', expirationDate: '2024-06-08' },
      { id: 4, name: 'Milk', quantity: '1 L', buyDate: '2024-06-05', expirationDate: '2024-06-07' },
      { id: 5, name: 'Eggs', quantity: '12 pcs', buyDate: '2024-06-01', expirationDate: '2024-06-15' },
      { id: 6, name: 'Bread', quantity: '1 loaf', buyDate: '2024-06-02', expirationDate: '2024-06-05' },
      { id: 7, name: 'Cheese', quantity: '200 g', buyDate: '2024-06-04', expirationDate: '2024-06-14' },
      { id: 8, name: 'Carrots', quantity: '1 kg', buyDate: '2024-06-03', expirationDate: '2024-06-10' },
      { id: 9, name: 'Butter', quantity: '250 g', buyDate: '2024-06-01', expirationDate: '2024-06-20' },
      { id: 10, name: 'Potatoes', quantity: '3 kg', buyDate: '2024-06-05', expirationDate: '2024-06-25' },
      { id: 11, name: 'Apples', quantity: '1 kg', buyDate: '2024-06-06', expirationDate: '2024-06-13' },
      { id: 12, name: 'Oranges', quantity: '2 kg', buyDate: '2024-06-07', expirationDate: '2024-06-15' },
      { id: 13, name: 'Bananas', quantity: '6 pcs', buyDate: '2024-06-08', expirationDate: '2024-06-14' },
      { id: 14, name: 'Spinach', quantity: '500 g', buyDate: '2024-06-09', expirationDate: '2024-06-11' },
      { id: 15, name: 'Lettuce', quantity: '1 head', buyDate: '2024-06-10', expirationDate: '2024-06-16' },
      { id: 16, name: 'Salmon Fillet', quantity: '300 g', buyDate: '2024-06-11', expirationDate: '2024-06-13' },
      { id: 17, name: 'Pasta', quantity: '500 g', buyDate: '2024-06-12', expirationDate: '2024-06-18' },
      { id: 18, name: 'Rice', quantity: '1 kg', buyDate: '2024-06-13', expirationDate: '2024-07-01' },
      { id: 19, name: 'Olive Oil', quantity: '500 ml', buyDate: '2024-06-14', expirationDate: '2025-06-14' },
      { id: 20, name: 'Ground Beef', quantity: '1 kg', buyDate: '2024-06-15', expirationDate: '2024-06-19' },
    ];
    return ingredients;
  };

  const getCurrentMeals = async () => {
    // TODO: Fetch current meals from the database
    return [
      {
        name: 'Chicken Stir Fry',
        ingredients: 'Chicken Breast, Onions, Bell Peppers',
        earliestExpirationDate: '2024-08-12',
      },
      {
        name: 'Vegetable Soup',
        ingredients: 'Tomato, Onions, Carrots',
        earliestExpirationDate: '2024-06-10',
      },
    ];
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleMealGeneration = () => {
    navigate('/generate-meals');
  };

  const handleGroceryGeneration = () => {
    navigate('/generate-groceries');
  };

  const handleUploadReceipt = (event) => {
    const file = event.target.files[0];

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 50 * 1024 * 1024) {
      setReceiptFile(file);
      setReceiptUploaded(true);
      setInputValue('');
      console.log('Receipt uploaded:', file.name);
      handleSubmitReceipt(file);
    } else {
      alert('Please upload a valid JPEG or PNG file up to 50 MB.');
    }
  };

  const handleSubmitReceipt = (file) => {
    // TODO: Logic to submit the receipt to the database
    // Add one to count of number uploaded recipets for profile page
    console.log('Submitting receipt:', file.name);
    setReceiptUploaded(false);
    setReceiptFile(null);
    setInputValue('');
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewIngredient({ name: '', quantity: '', buyDate: '', expirationDate: '' });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveIngredient = async () => {
    // TODO: Save the new ingredient to the database
    console.log('Saving new ingredient:', newIngredient);
    closeModal();
    
    // After saving, fetch the updated ingredients
    const updatedIngredients = await getIngredients();
    setIngredients(updatedIngredients);
  };

  const getTodaysDate = () => {
    // TODO: Replace with actual logic to get today's date
    return new Date('2024-06-15');
  };

  // Function to check if a date is within 3 days from today
  const isWithinThreeDays = (date) => {
    const today = getTodaysDate();
    const targetDate = new Date(date);
    const diffInDays = (targetDate - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 3;
  };

  // Sort by increasing expiration date
  const sortedIngredients = [...ingredients].sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
  const sortedCurrentMeals = [...currentMeals].sort((a, b) => new Date(a.earliestExpirationDate) - new Date(b.earliestExpirationDate));

  return (
    <div className="flex flex-col h-screen font-montserrat bg-custom-white">
      <div className="flex h-1/5 justify-between mb-2">
        <div className="flex flex-col items-center pl-16 flex-grow">
          <img src={logo} alt="Logo" className="h-full" />
          <div className="text-lg text-center">swipe right and take a bite!</div>
        </div>
        <button onClick={handleProfile} className="relative w-20 h-20 rounded-full bg-custom-white cursor-pointer flex items-center justify-center">
          <img src={profile} alt="Profile" className="max-w-[70%] max-h-[70%] mb-2" />
        </button>
      </div>
      <div className="flex h-4/5">
        <div className="flex flex-col w-1/3 p-5">
          <div className="max-h-[60vh] overflow-y-auto border border-gray-300 bg-gray-100 shadow-md font-mono">
            <h1 className="sticky top-0 bg-white p-2 m-0 z-10 text-center font-montserrat font-bold">Ingredients List</h1>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">ITEM</th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">QTY</th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">BUY DATE</th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">EXP DATE</th>
                </tr>
              </thead>
              <tbody>
              {sortedIngredients.map(ingredient => (
                <tr key={ingredient.id}>
                  <td className="p-3 border-b border-gray-300">
                    {ingredient.name}
                  </td>
                  <td className="p-3 border-b border-gray-300">
                    {ingredient.quantity}
                  </td>
                  <td className="p-3 border-b border-gray-300">
                    {ingredient.buyDate}
                  </td>
                  <td className={isWithinThreeDays(ingredient.expirationDate) ? 'p-3 border-b border-gray-300 text-custom-red-200' : 'p-3 border-b border-gray-300'}>
                    {ingredient.expirationDate}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-5 gap-5">
            <label className="relative w-36 h-36 rounded-full bg-custom-red-200 cursor-pointer flex flex-col items-center justify-center shadow-md transition-transform duration-300 hover:bg-custom-red-100 overflow-hidden">
              <img src={receipt} alt="Upload Receipt" className="max-w-[40%] max-h-[40%] mb-1" />
              <span className="text-center text-sm text-white font-bold">{receiptUploaded ? 'Submit' : 'Upload Receipt'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleUploadReceipt}
                className="hidden"
                value={inputValue}
                onClick={(event) => {
                  event.currentTarget.value = '';
                }}
              />
            </label>
            <button onClick={openModal} className="relative w-36 h-36 rounded-full bg-custom-red-200 cursor-pointer flex flex-col items-center justify-center shadow-md transition-transform duration-300 hover:bg-custom-red-100 overflow-hidden">
              <img src={tomato} alt="Add Ingredient" className="max-w-[40%] max-h-[40%] mb-1" />
              <span className="text-center text-sm text-white font-bold">Add Ingredient</span>
            </button>
          </div>
        </div>
        <div className='flex flex-col items-center w-1/3 p-5'>
          <button onClick={handleMealGeneration} className="relative w-64 h-64 rounded-md bg-custom-red-300 cursor-pointer flex flex-col items-center justify-center shadow-md transition-transform duration-300 hover:bg-custom-red-200 mb-5">
            <img src={meal} alt="Generate Meals" className="max-w-[70%] max-h-[70%] mb-2" />
            <span className="text-white font-bold">Generate Meals</span>
          </button>
          <button onClick={handleGroceryGeneration} className="relative w-64 h-64 rounded-md bg-custom-red-300 cursor-pointer flex flex-col items-center justify-center shadow-md transition-transform duration-300 hover:bg-custom-red-200">
            <img src={grocery} alt="Generate Groceries" className="max-w-[70%] max-h-[70%] mb-2" />
            <span className="text-white font-bold">Generate Groceries</span>
          </button>
        </div>
        <div className='flex flex-col items-center w-1/3 p-5'>
          <div className="max-h-[60vh] overflow-y-auto border border-gray-300 bg-gray-100 shadow-md font-mono">
            <h1 className="sticky top-0 bg-white p-2 m-0 z-10 text-center font-montserrat font-bold">Current Meals List</h1>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">MEAL NAME</th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">INGREDIENTS</th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">EARLIEST EXP DATE</th>
                </tr>
              </thead>
              <tbody>
                {sortedCurrentMeals.map(meal => (
                  <tr key={meal.id}>
                    <td className="p-3 border-b border-gray-300">
                      {meal.name}
                    </td>
                    <td className="p-3 border-b border-gray-300">
                      {meal.ingredients}
                    </td>
                    <td className={isWithinThreeDays(meal.earliestExpirationDate) ? 'p-3 border-b border-gray-300 text-custom-red-200' : 'p-3 border-b border-gray-300'}>
                      {meal.earliestExpirationDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Ingredient Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">Add Ingredient</h2>
            <input
              type="text"
              name="name"
              value={newIngredient.name}
              onChange={handleInputChange}
              placeholder="Ingredient Name"
              className="w-full p-2 border border-gray-300 mb-2"
            />
            <input
              type="text"
              name="quantity"
              value={newIngredient.quantity}
              onChange={handleInputChange}
              placeholder="Ingredient Quantity"
              className="w-full p-2 border border-gray-300 mb-2"
            />
            <input
              type="date"
              name="buyDate"
              value={newIngredient.buyDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 mb-2"
            />
            <input
              type="date"
              name="expirationDate"
              value={newIngredient.expirationDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 mb-4"
            />
            <button
              onClick={handleSaveIngredient}
              className="w-full p-2 bg-custom-red-300 text-white font-bold rounded"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              className="w-full p-2 mt-2 border border-gray-300 text-gray-700 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

