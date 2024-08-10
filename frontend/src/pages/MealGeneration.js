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

  useEffect(() => {
    resetPosition();
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
        setTimeout(() => handleMealAccept(), 25);
        return;
      } else {
        document.body.classList.remove('flash-green');
      }
  
      // Check if the card touches the left edge
      if (mealCard.offsetLeft <= 0) {
        document.body.classList.add('flash-red');
        setTimeout(() => handleMealReject(), 25);
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

  const handleMealAccept = () => {
    const meal = meals[currentMealIndex];
    // TODO: Send meal to the database
    console.log('Meal accepted:', meal);
  
    setTimeout(() => {
      moveToNextMeal();
      resetPosition();
    }, 500);
  };
  
  const handleMealReject = () => {
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
      console.log('All meals processed. Redirecting to home.');
      navigate('/home');
    }
  };

  if (!meals || meals.length === 0) {
    return <div className="flex items-center justify-center h-screen">No meals available.</div>;
  }

  const meal = meals[currentMealIndex >= meals.length ? meals.length - 1 : currentMealIndex];

  return (
    <div className="meal-card-generation flex items-center justify-center h-screen relative cursor-pointer select-none bg-custom-white">
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