import React, { useState } from 'react';
import filledStar from '../assets/star-filled.png';
import emptyStar from '../assets/star-outline.png';
import check from '../assets/check.png';
import remove from '../assets/close.png';

const MealCard = ({ meal, isProfile, onAccept, onReject }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAccept = () => {
    onAccept(isFavorite); // Pass the favorite status to the parent
    setIsFavorite(false); // Reset favorite status after accepting
  };

  const handleReject = () => {
    onReject(isFavorite); // Pass the favorite status to the parent
    setIsFavorite(false); // Reset favorite status after accepting
  };

  return (
    <div className="flex flex-col w-96 h-auto bg-white shadow-lg rounded-md">
      <div className="relative w-full h-64 border-b-4 border-black">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
        {!isProfile && (
          <div
            className="absolute top-2 right-2 cursor-pointer w-10 h-10"
            onClick={handleFavoriteClick}
          >
            <img src={isFavorite ? filledStar : emptyStar} alt="Favorite" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center p-4">
        <div className="text-xl font-bold text-center">{meal.name}</div>
        <div className="text-m text-center mt-1 text-gray-500">{meal.calories} cals | {meal.cookTime} mins</div>
        <div className="text-center mt-4">
          <ul className="columns-2 space-y-1 list-disc text-sm">
            {Object.entries(meal.ingredients).map(([_, ingredient], index) => (
              <li key={index} className="break-words pr-2">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {!isProfile && (
        <div className="flex w-full h-16 mt-4">
          <button
            className="flex-1 bg-custom-red-300 hover:bg-custom-red-200 text-white flex items-center justify-center h-full"
            onClick={handleReject}
          >
            <img src={remove} alt="Remove" className="w-8 h-8" />
          </button>
          <button
            className="flex-1 bg-green-500 hover:bg-green-400 text-white flex items-center justify-center h-full"
            onClick={handleAccept}
          >
            <img src={check} alt="Check" className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MealCard;