import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MealCard from './MealCard';
import './MealGeneration.css';

const MealGeneration = ({ meals }) => {
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const mealCardRef = useRef(null);
  const navigate = useNavigate();

  const [mealsGenerated, setMealsGenerated] = useState(0);
  const [mealsAccepted, setMealsAccepted] = useState(0);
  const [mealsRejected, setMealsRejected] = useState(0);
  const [ingredientsSaved, setIngredientsSaved] = useState(0);
  const [mealsFavorited, setMealsFavorited] = useState(0);

  useEffect(() => {
    resetPosition();
    setMealsGenerated(meals.length);
  }, [meals]);

  const handleDragStart = (event) => {
    setIsDragging(true);
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    resetPosition();
  };

  const handleDrag = (event) => {
    if (isDragging && mealCardRef.current) {
      const deltaX = event.clientX - position.x;
      const deltaY = event.clientY - position.y;
  
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
  
      const mealCard = mealCardRef.current;
      mealCard.style.left = `${mealCard.offsetLeft + deltaX}px`;
      mealCard.style.top = `${mealCard.offsetTop + deltaY}px`;
  
      // Check if the card touches the right edge
      if (mealCard.offsetLeft + mealCard.offsetWidth >= window.innerWidth) {
        document.body.classList.add('flash-green');
        setTimeout(() => handleMealAccept(), 500);
        return;
      } else {
        document.body.classList.remove('flash-green');
      }
  
      // Check if the card touches the left edge
      if (mealCard.offsetLeft <= 0) {
        document.body.classList.add('flash-red');
        setTimeout(() => handleMealReject(), 500);
        return;
      } else {
        document.body.classList.remove('flash-red');
      }
    }
  };

  const resetPosition = () => {
    if (mealCardRef.current) {
      const mealCard = mealCardRef.current;
      const centerLeft = (window.innerWidth - mealCard.offsetWidth) / 2;
      const centerTop = (window.innerHeight - mealCard.offsetHeight) / 2;
      mealCard.style.left = `${centerLeft}px`;
      mealCard.style.top = `${centerTop}px`;
    }
    document.body.classList.remove('flash-green', 'flash-red');
  };

  const handleMealAccept = (isFavorite) => {
    const meal = meals[currentMealIndex];
    const ingredientCount = Object.keys(meal.ingredients).length;
    setIngredientsSaved((prev) => prev + ingredientCount);
    setMealsAccepted((prev) => prev + 1);

    // Add to favorites if the meal is favorited
    if (isFavorite) {
      // TODO: Add meal to favorites in the database
      setMealsFavorited((prev) => prev + 1);
      console.log('Meal favorited:', meal);
    }

    // TODO: Send accepted meal to the database as meal object to be stored in current meals
    console.log('Meal accepted:', meal);

    setTimeout(() => {
      moveToNextMeal();
      resetPosition();
    }, 500);
  };

  const handleMealReject = (isFavorite) => {
    setMealsRejected((prev) => prev + 1);
    // Add to favorites if the meal is favorited
    if (isFavorite) {
      // TODO: Add meal to favorites in the database
      setMealsFavorited((prev) => prev + 1);
      console.log('Meal favorited:', meal);
    }
    console.log('Meal rejected:', meals[currentMealIndex]);

    setTimeout(() => {
      moveToNextMeal();
      resetPosition();
    }, 500);
  };

  const moveToNextMeal = () => {
    if (currentMealIndex < meals.length - 1) {
      setCurrentMealIndex(currentMealIndex + 1);
    } else {
      console.log('All meals processed. Updating database with counts.');
      console.log("Meals Generated: ", mealsGenerated);
      console.log("Meals Accepted: ", mealsAccepted);
      console.log("Meals Rejected: ", mealsRejected);
      console.log("Ingredients Saved: ", ingredientsSaved);
      console.log("Meals Favorited: ", mealsFavorited);
      // TODO: Update the database with the counts (mealsGenerated, mealsRejected, mealsAccepted, ingredientsSaved, mealsFavorited)
      navigate('/home');
    }
  };

  if (!meals || meals.length === 0) {
    return <div className="flex items-center justify-center h-screen">No meals available.</div>;
  }

  const meal = meals[currentMealIndex >= meals.length ? meals.length - 1 : currentMealIndex];

  return (
    <div className="meal-card-generation flex items-center justify-center h-screen relative cursor-pointer select-none">
      <div
        className="absolute"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        ref={mealCardRef}
      >
        <MealCard
          meal={meal}
          isProfile={false}
          onAccept={handleMealAccept}
          onReject={handleMealReject}
        />
      </div>
    </div>
  );
};

export default MealGeneration;