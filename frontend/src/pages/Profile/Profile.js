import React from 'react';
import Select from 'react-select';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import MealCard from '../MealCard';
import profile from '../../assets/profile-user.png';
import saladImg from '../../assets/salad.jpg';
import ingredientsIcon from '../../assets/tomato.png';
import receiptsIcon from '../../assets/receipt.png';
import favoriteIcon from '../../assets/star-filled.png';

Chart.register(ArcElement, Tooltip);

const Profile = () => {
  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian', color: '#4caf50' },
    { value: 'vegan', label: 'Vegan', color: '#ff9800' },
    { value: 'gluten-free', label: 'Gluten-Free', color: '#2196f3' },
    { value: 'nut-allergies', label: 'Nut Allergies', color: '#f44336' },
  ];

  const cuisineOptions = [
    { value: 'italian', label: 'Italian', color: '#e91e63' },
    { value: 'indian', label: 'Indian', color: '#9c27b0' },
    { value: 'chinese', label: 'Chinese', color: '#3f51b5' },
    { value: 'thai', label: 'Thai', color: '#00bcd4' },
    { value: 'french', label: 'French', color: '#8bc34a' },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.color,
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: state.data.color,
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: 'white',
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      color: 'white',
      ':hover': {
        backgroundColor: state.data.color,
        color: 'black',
      },
    }),
  };

  const salad = {
    image: saladImg,
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
  };

  const meals = [salad, salad, salad, salad, salad]; // Add more meals as needed

  const donutData = {
    labels: ['Accepted', 'Rejected'],
    datasets: [
      {
        data: [60, 40], // Example data
        backgroundColor: ['#15803d', '#921A40'],
        hoverBackgroundColor: ['#16a34a', '#C75B7A'],
      },
    ],
  };

  const donutOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const dataset = tooltipItem.dataset;
            const index = tooltipItem.dataIndex;
            const label = donutData.labels[index];
            const value = dataset.data[index];
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-custom-white">
      <div className="flex flex-col items-center w-4/5 h-4/5 mx-auto bg-custom-red p-5 shadow-lg rounded-lg">
        <div className="flex justify-between w-full mb-3 space-x-5">
          <div className="bg-white rounded-lg p-5 w-1/4 shadow-md flex flex-col items-center">
            <img src={profile} alt="Profile" className="w-36 h-36 rounded-full mb-3 border border-black" />
            <div className="text-center">
              <h2 className="text-black text-2xl">John Doe</h2>
              <p className="text-gray-500 text-sm">john.doe@example.com</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 w-1/4 shadow-md flex flex-col items-center">
            <Doughnut data={donutData} options={donutOptions} />
            <div className="text-center mt-2">
              <p className="text-custom-red-300 text-2xl font-bold">5</p>
              <span className="text-gray-500">Meals Generated</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 w-1/4 shadow-md">
            <div className="flex flex-col gap-5">
              <h4 className="font-bold text-center">Preferences</h4>
              <Select options={dietaryOptions} isMulti placeholder="Dietary Restrictions" styles={customStyles} />
              <Select options={cuisineOptions} isMulti placeholder="Preferred Cuisines" styles={customStyles} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 w-1/4 shadow-md flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-start bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
                <img src={ingredientsIcon} alt="Ingredients" className="w-8 h-8 mr-2" />
                <p><strong>7</strong> Ingredients Saved</p>
              </div>
              <div className="flex items-center justify-start bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
                <img src={receiptsIcon} alt="Receipts" className="w-8 h-8 mr-2" />
                <p><strong>3</strong> Receipts Uploaded</p>
              </div>
              <div className="flex items-center justify-start bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
                <img src={favoriteIcon} alt="Favorites" className="w-8 h-8 mr-2" />
                <p><strong>5</strong> Favorite Meals</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-xl font-bold mb-3 text-center text-custom-red-300">Favorites</h2>
          <div className="flex gap-5 overflow-x-auto whitespace-nowrap rounded-lg">
            {meals.map((meal, index) => (
              <MealCard key={index} meal={meal} isProfile={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
