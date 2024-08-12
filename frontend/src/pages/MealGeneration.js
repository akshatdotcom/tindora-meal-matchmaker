import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/db';
import { doc, updateDoc, increment, collection, addDoc } from 'firebase/firestore';
import MealCard from './MealCard';
import './MealGeneration.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MealGeneration = ({ meals }) => {
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const mealCardRef = useRef(null);
  const navigate = useNavigate();

  const [mealsAccepted, setMealsAccepted] = useState(0);
  const [mealsRejected, setMealsRejected] = useState(0);
  const [ingredientsSaved, setIngredientsSaved] = useState(0);
  const [mealsFavorited, setMealsFavorited] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const handleMealAccept = async (isFavorite) => {
    console.log('Current User:', currentUser);
    const meal = meals[currentMealIndex];
    console.log('Current Meal:', meal);
  
    if (!currentUser || !currentUser.uid) {
      console.error("Current user is not valid");
      return;
    }
  
    if (!meal) {
      console.error("Current meal is not valid", meal);
      return;
    }
  
    const ingredientCount = Object.keys(meal.ingredients).length;
    setIngredientsSaved((prev) => prev + ingredientCount);
    setMealsAccepted((prev) => prev + 1);
  
    const userRef = doc(db, 'users', currentUser.uid);
    const currentMealsCollection = collection(userRef, 'currentMeals');
    const favoriteMealsCollection = collection(userRef, 'favoriteMeals');
  
    try {
      await addDoc(currentMealsCollection, meal);
  
      console.log('Meal accepted:', meal);
  
      if (isFavorite) {
        await addDoc(favoriteMealsCollection, meal);
        setMealsFavorited((prev) => prev + 1);
        console.log('Meal favorited:', meal);
      }
  
      setTimeout(() => {
        moveToNextMeal();
        resetPosition();
      }, 500);
    } catch (error) {
      console.error('Error updating meal in Firestore:', error);
    }
  };
  
  const handleMealReject = async (isFavorite) => {
    setMealsRejected((prev) => prev + 1);
  
    const userRef = doc(db, 'users', currentUser.uid);
    const favoriteMealsCollection = collection(userRef, 'favoriteMeals');
  
    try {
      if (isFavorite) {
        const favoriteMealRef = await addDoc(favoriteMealsCollection, meal);
        setMealsFavorited((prev) => prev + 1);
        console.log('Meal favorited:', meal);
        console.log('Favorite Meal Document ID:', favoriteMealRef.id);
      }
  
      console.log('Meal rejected:', meals[currentMealIndex]);
  
      setTimeout(() => {
        moveToNextMeal();
        resetPosition();
      }, 500);
    } catch (error) {
      console.error('Error updating favorite meal in Firestore:', error);
    }
  };

  const moveToNextMeal = async () => {
    if (currentMealIndex < meals.length - 1) {
      setCurrentMealIndex(currentMealIndex + 1);
    } else {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          mealsAccepted: increment(mealsAccepted),
          mealsRejected: increment(mealsRejected),
          ingredientsSaved: increment(ingredientsSaved),
          mealsFavorited: increment(mealsFavorited),
        });
  
        console.log('All meals processed and database updated.');
        navigate('/home');
      } catch (error) {
        console.error('Error updating user stats in Firestore:', error);
      }
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