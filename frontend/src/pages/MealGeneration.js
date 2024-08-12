import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/db";
import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import MealCard from "./MealCard";
import "./MealGeneration.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCallback } from "react";

const MealGeneration = () => {
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

  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    resetPosition();
  }, [foods]);

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    if (mealCardRef.current) {
      mealCardRef.current.style.transform = `translate(0px, 0px)`;
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const threshold = 100;
    if (position.x > threshold) {
      handleMealAccept(false);
    } else if (position.x < -threshold) {
      handleMealReject(false);
    } else {
      resetPosition();
    }
  };

  const handleDrag = (e) => {
    if (isDragging) {
      const newX = e.clientX - window.innerWidth / 2;
      const newY = e.clientY - window.innerHeight / 2;
      setPosition({ x: newX, y: newY });
      if (mealCardRef.current) {
        mealCardRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    }
  };

  const getCuisines = async () => {
    const uid = auth.currentUser.uid;
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.data().cuisines || [];
  };

  const getIngredients = async () => {
    const uid = auth.currentUser.uid;
    const ingredientsCollection = collection(db, "users", uid, "ingredients");
    const ingredientsSnapshot = await getDocs(ingredientsCollection);
    const ingredientsList = ingredientsSnapshot.docs.map((doc) => doc.data());
    return JSON.stringify(ingredientsList);
  };

  const getDietaryRestrictions = async () => {
    const uid = auth.currentUser.uid;
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.data().dietaryRestrictions || "";
  };

  const fetchMeals = useCallback(async (retryCount = 3) => {
    console.log("Fetching meals...");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCQVb79NBO9crsndXAaV3dPvzSWrqDk0hg"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const json_schema = `[
        {
          "name": "Example Meal Name 1",
          "ingredients": ["Ingredient 1", "Ingredient 2"],
          "earliestExpirationDate": "YYYY-MM-DD",
          "calories": <number>,
          "cookTime": <number>
        }
      ]`;

      const ingredientsJson = await getIngredients();
      const dietaryRestrictions = await getDietaryRestrictions();
      const cuisines = await getCuisines();

      const prompt = `Using the JSON list of ingredients provided below, provide a meal plan 
      based on the name category. Make sure to consider the expiration date (labeled end) and prioritize 
      ingredients that expire earlier. Also consider the quantity of each food item. Once you've used an ingredient once, don't use it for another meal. 
      Only use the list of ingredients provided to you below as the context, and do not add any ingredients.
      Also keep in mind the dietary restrictions mentioned below.
      Always estimate the meal's calories and cook time. Both are numbers and must be provided in the response (not provided is unacceptable). A general estimate is acceptable.
      If you must add ingredients not in the list, include a 'not provided' in the string. Do not provide meals that only use ingredients that are not listed below. 
      Only return the response in the JSON schema format ${json_schema}.\nIngredients:\n${ingredientsJson}\nDietary Restrictions:\n${dietaryRestrictions}
      \nPreferred Cuisines: ${cuisines}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response
        .text()
        .replace(/```|json/gi, "")
        .trim();
      console.log(text);
      const data = JSON.parse(text);

      console.log("Generated meals:", data);

      setFoods(data);
      setCurrentMealIndex(0);
      setIsLoading(false);
      toast(`Generated ${data.length} unique meals`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error generating meals:", error);
      if (retryCount > 0) {
        setTimeout(() => fetchMeals(retryCount - 1), 2000);
      } else {
        setIsLoading(false);
        toast.error(`Error generating meals: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }, []);

  const handleMealAccept = async (isFavorite) => {
    console.log("Current User:", currentUser);
    const meal = foods[currentMealIndex];
    console.log("Current Meal:", meal);

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

    const userRef = doc(db, "users", currentUser.uid);
    const currentMealsCollection = collection(userRef, "currentMeals");
    const favoriteMealsCollection = collection(userRef, "favoriteMeals");

    try {
      await addDoc(currentMealsCollection, meal);

      console.log("Meal accepted:", meal);

      if (isFavorite) {
        await addDoc(favoriteMealsCollection, meal);
        setMealsFavorited((prev) => prev + 1);
        console.log("Meal favorited:", meal);
      }

      setTimeout(() => {
        moveToNextMeal();
        resetPosition();
      }, 500);
    } catch (error) {
      console.error("Error updating meal in Firestore:", error);
    }
  };

  const handleMealReject = async (isFavorite) => {
    setMealsRejected((prev) => prev + 1);

    const userRef = doc(db, "users", currentUser.uid);
    const favoriteMealsCollection = collection(userRef, "favoriteMeals");

    try {
      if (isFavorite) {
        const favoriteMealRef = await addDoc(favoriteMealsCollection, meal);
        setMealsFavorited((prev) => prev + 1);
        console.log("Meal favorited:", meal);
        console.log("Favorite Meal Document ID:", favoriteMealRef.id);
      }

      console.log("Meal rejected:", foods[currentMealIndex]);

      setTimeout(() => {
        moveToNextMeal();
        resetPosition();
      }, 500);
    } catch (error) {
      console.error("Error updating favorite meal in Firestore:", error);
    }
  };

  const moveToNextMeal = async () => {
    if (currentMealIndex < foods.length - 1) {
      setCurrentMealIndex(currentMealIndex + 1);
    } else {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          mealsAccepted: increment(mealsAccepted),
          mealsRejected: increment(mealsRejected),
          ingredientsSaved: increment(ingredientsSaved),
          mealsFavorited: increment(mealsFavorited),
        });

        console.log("All meals processed and database updated.");
        navigate("/home");
      } catch (error) {
        console.error("Error updating user stats in Firestore:", error);
      }
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading meals...
      </div>
    );
  }

  if (!foods || foods.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        No meals available.
      </div>
    );
  }

  const meal =
    foods[
      currentMealIndex >= foods.length ? foods.length - 1 : currentMealIndex
    ];

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
      <ToastContainer />
    </div>
  );
};

export default MealGeneration;
