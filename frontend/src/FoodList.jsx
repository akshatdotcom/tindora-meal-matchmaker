import React, { useState, useEffect } from "react";
import FoodCard from "./FoodCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";
import "./FoodList.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "./firebase/auth";
import { db } from "./firebase/db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

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

  const fetchMeals = async (retryCount = 3) => {
    console.log("Fetching meals...");
    setIsLoading(true);

    try {
      const GEMINI_API_KEY = "AIzaSyCTHER10arC87fY5JEDfxBnzsmyIhcKmQw";
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

      const prompt = `Using the JSON list of ingredients provided below, provide a meal plan 
      based on the name category. Make sure to consider the expiration date (labeled end) and prioritize 
      ingredients that expire earlier. Also consider the quantity of each food item. Once you've used an ingredient once, don't use it for another meal. 
      Only use the list of ingredients provided to you below as the context, and do not add any ingredients.
      Also keep in mind the dietary restrictions mentioned below. 
      If you must add ingredients not in the list, include a 'not provided' in the string. Do not provide meals that only use ingredients that are not listed below. 
      Only return the response in the JSON schema format ${json_schema}.\nIngredients:\n${ingredientsJson}\nDietary Restrictions:\n${dietaryRestrictions}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const data = JSON.parse(response.text());

      console.log("Generated meals:", data);

      setFoods(data);
      setCurrentIndex(0);
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
  };

  const handleCheck = () => {
    // TODO: Implement handleCheck function
    if (currentIndex < foods.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleCross = () => {
    if (currentIndex < foods.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="food-list-container">
      <div className="food-list">
        {foods.length > 0 && currentIndex < foods.length ? (
          <FoodCard
            food={foods[currentIndex]}
            onCheck={handleCheck}
            onCross={handleCross}
          />
        ) : (
          <div className="no-meal-available"></div>
        )}
        {currentIndex >= foods.length && (
          <button
            className="btn btn-success btn-lg fetch-button"
            onClick={() => fetchMeals()}
            disabled={isLoading}
            style={{ backgroundColor: "#A9E2A9" }}
          >
            {isLoading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Fetch More Meals"
            )}
          </button>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default FoodList;
