import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import receipt from "../assets/receipt.png";
import tomato from "../assets/tomato.png";
import grocery from "../assets/grocery.png";
import meal from "../assets/meal.png";
import profile from "../assets/user.png";
import logo from "../assets/logo.png";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import { doc, setDoc } from "firebase/firestore";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const LandingPage = () => {
  const navigate = useNavigate();
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [currentMeals, setCurrentMeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
    buyDate: "",
    expirationDate: "",
  });

  const [user, setUser] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  const fetchData = async (uid) => {
    const fetchedIngredients = await getIngredients(uid);
    const fetchedMeals = await getCurrentMeals(uid);
    setIngredients(fetchedIngredients);
    setCurrentMeals(fetchedMeals);
  };

  useEffect(() => {
    if (fetchData) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is signed in:", user.uid);
          setUser(user);
          fetchData(user.uid);
        } else {
          navigate("/"); // Redirect to login if not signed in
        }
      });

      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, navigate]);

  const getIngredients = async (uid) => {
    const ingredientsCollection = collection(db, "users", uid, "ingredients");
    const ingredientsSnapshot = await getDocs(ingredientsCollection);
    const ingredientsList = ingredientsSnapshot.docs.map((doc) => doc.data());
    return ingredientsList;
  };

  const getCurrentMeals = async (uid) => {
    const mealsCollection = collection(db, "users", uid, "currentMeals");
    const mealsSnapshot = await getDocs(mealsCollection);
    const mealsList = mealsSnapshot.docs.map((doc) => doc.data());
    return mealsList;
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleMealGeneration = () => {
    navigate("/generate-meals");
  };

  const handleGroceryGeneration = () => {
    navigate("/generate-groceries");
  };

  const handleUploadReceipt = (event) => {
    const file = event.target.files[0];

    if (
      file &&
      (file.type === "image/jpeg" || file.type === "image/png") &&
      file.size <= 50 * 1024 * 1024
    ) {
      setReceiptFile(file);
      setReceiptUploaded(true);
      setInputValue("");
      console.log("Receipt uploaded:", file.name);
      handleSubmitReceipt(file);
    } else {
      alert("Please upload a valid JPEG or PNG file up to 50 MB.");
    }
  };

  const handleSubmitReceipt = async (file) => {
    try {
      const imageBuffer = await file.arrayBuffer();
      const base64Image = btoa(
        new Uint8Array(imageBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const genAI = new GoogleGenerativeAI(
        "AIzaSyCQVb79NBO9crsndXAaV3dPvzSWrqDk0hg"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Given the image of the attached receipt, extract and display the following in a consistent format:
      
      - Receipt purchase date
      - Each item's name (infer a simple, generalized name given the words on the receipt without branding), total quantity (infer based on unit price and quantity purchased), and estimated expiration date (give a best guess for an exact date based on item and purchase date). The buy date is likely close to today's date.
      
      Ignore items that are inedible or irrelevant to cooking ingredients.
      
      Only use the image as context. Do not add any extra items.
      
      Your response must be in JSON format in the following schema:
      
      {
          "ingredients": [
              {
              "name": "Item name",
              "quantity": 1,
              "buyDate": "YYYY-MM-DD",
              "expirationDate": "YYYY-MM-DD"
              },
              {
              "name": "Item name",
              "quantity": 1,
              "buyDate": "YYYY-MM-DD",
              "expirationDate": "YYYY-MM-DD"
              },
              ...
          ]
      }
      
      The JSON will be immediately parsed without any human intervention. If the JSON is not in the correct format, the response will be considered incorrect.`;

      const imageParts = [
        {
          inlineData: {
            data: base64Image,
            mimeType: file.type,
          },
        },
      ];

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response
        .text()
        .replace(/```|json/gi, "")
        .trim();
      console.log(text);
      const jsonText = JSON.parse(text);

      // Update state with new ingredients
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        ...jsonText.ingredients.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          buyDate: item.buyDate,
          expirationDate: item.expirationDate,
        })),
      ]);

      console.log(ingredients);

      console.log("Receipt processed successfully:", jsonText);
      setReceiptUploaded(false);
      setReceiptFile(null);
      setInputValue("");

      // Save the new ingredients to the database
      const ingredientsCollection = collection(
        db,
        "users",
        user.uid,
        "ingredients"
      );

      await Promise.all(
        jsonText.ingredients.map(async (item) => {
          // Create new doc in the ingredients collection for each ingredient
          const newDocRef = doc(ingredientsCollection);

          await setDoc(newDocRef, {
            name: item.name,
            quantity: item.quantity,
            buyDate: item.buyDate,
            expirationDate: item.expirationDate,
          });
        })
      );
    } catch (error) {
      console.error("Error processing receipt:", error);
      alert("Failed to process receipt. Please try again.");
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewIngredient({
      name: "",
      quantity: "",
      buyDate: "",
      expirationDate: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveIngredient = async () => {
    try {
      // Get a reference to the user's ingredients collection
      const ingredientsCollection = collection(
        db,
        "users",
        user.uid,
        "ingredients"
      );

      const newIngredientData = {
        name: newIngredient.name,
        quantity: newIngredient.quantity,
        buyDate: newIngredient.buyDate,
        expirationDate: newIngredient.expirationDate,
      };

      // Create a new document reference
      const newIngredientRef = doc(ingredientsCollection);

      // Save the new ingredient to the database
      await setDoc(newIngredientRef, newIngredientData);

      console.log("Saving new ingredient:", newIngredient);
      closeModal();

      // Update state with the new ingredient
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        newIngredientData,
      ]);
    } catch (error) {
      console.error("Error saving ingredient:", error);
      // You might want to show an error message to the user here
    }
  };

  // Function to check if a date is within 3 days from today
  const isWithinThreeDays = (date) => {
    const today = Date.now();
    const targetDate = new Date(date);
    const diffInDays = (targetDate - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 3;
  };

  // Sort by increasing expiration date
  const sortedIngredients = [...ingredients].sort(
    (a, b) => new Date(a.expirationDate) - new Date(b.expirationDate)
  );
  const sortedCurrentMeals = [...currentMeals].sort(
    (a, b) =>
      new Date(a.earliestExpirationDate) - new Date(b.earliestExpirationDate)
  );

  return (
    <div className="flex flex-col h-screen font-montserrat bg-custom-white">
      <div className="flex h-1/5 justify-between mb-2">
        <div className="flex flex-col items-center pl-16 flex-grow">
          <img src={logo} alt="Logo" className="h-full" />
          <div className="text-lg text-center pl-5">
            swipe right and take a bite!
          </div>
        </div>
        <button
          onClick={handleProfile}
          className="relative w-20 h-20 rounded-full bg-custom-white cursor-pointer flex items-center justify-center"
        >
          <img
            src={profile}
            alt="Profile"
            className="max-w-[70%] max-h-[70%] mb-2"
          />
        </button>
      </div>
      <div className="flex h-4/5">
        <div className="flex flex-col w-1/3 p-5">
          <div className="max-h-[60vh] overflow-y-auto border border-gray-300 bg-gray-100 shadow-md font-mono">
            <h1 className="sticky top-0 bg-white p-2 m-0 z-10 text-center font-montserrat font-bold">
              Ingredients List
            </h1>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">
                    ITEM
                  </th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">
                    QTY
                  </th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">
                    BUY DATE
                  </th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">
                    EXP DATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedIngredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td className="p-3 border-b border-gray-300">
                      {ingredient.name}
                    </td>
                    <td className="p-3 border-b border-gray-300">
                      {ingredient.quantity}
                    </td>
                    <td className="p-3 border-b border-gray-300">
                      {ingredient.buyDate}
                    </td>
                    <td
                      className={
                        isWithinThreeDays(ingredient.expirationDate)
                          ? "p-3 border-b border-gray-300 text-custom-red-200"
                          : "p-3 border-b border-gray-300"
                      }
                    >
                      {ingredient.expirationDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-5 gap-5">
            <label className="relative w-36 h-36 rounded-full bg-custom-red-200 cursor-pointer flex flex-col items-center justify-center shadow-md transition-transform duration-300 hover:bg-custom-red-100 overflow-hidden">
              <img
                src={receipt}
                alt="Upload Receipt"
                className="max-w-[40%] max-h-[40%] mb-1"
              />
              <span className="text-center text-sm text-white font-bold">
                {receiptUploaded ? "Processing..." : "Upload Receipt"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleUploadReceipt}
                className="hidden"
                value={inputValue}
                onClick={(event) => {
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <button
              onClick={openModal}
              className="relative w-36 h-36 rounded-full bg-custom-red-200 cursor-pointer flex flex-col items-center justify-center shadow-md transition-transform duration-300 hover:bg-custom-red-100 overflow-hidden"
            >
              <img
                src={tomato}
                alt="Add Ingredient"
                className="max-w-[40%] max-h-[40%] mb-1"
              />
              <span className="text-center text-sm text-white font-bold">
                Add Ingredient
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center w-1/3 p-5">
          <button
            onClick={handleMealGeneration}
            className="relative w-64 h-64 rounded-md bg-custom-red-300 cursor-pointer flex flex-col items-center justify-center shadow-md transition-transform duration-300 hover:bg-custom-red-200 mb-5"
          >
            <img
              src={meal}
              alt="Generate Meals"
              className="max-w-[70%] max-h-[70%] mb-2"
            />
            <span className="text-white font-bold">Generate Meals</span>
          </button>
          <button
            onClick={handleGroceryGeneration}
            className="relative w-64 h-64 rounded-md bg-custom-red-300 cursor-pointer flex flex-col items-center justify-center shadow-md transition-transform duration-300 hover:bg-custom-red-200"
          >
            <img
              src={grocery}
              alt="Generate Groceries"
              className="max-w-[70%] max-h-[70%] mb-2"
            />
            <span className="text-white font-bold">Generate Groceries</span>
          </button>
        </div>
        <div className="flex flex-col items-center w-1/3 p-5">
          <div className="max-h-[60vh] overflow-y-auto border border-gray-300 bg-gray-100 shadow-md font-mono">
            <h1 className="sticky top-0 bg-white p-2 m-0 z-10 text-center font-montserrat font-bold">
              Current Meals List
            </h1>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">
                    MEAL NAME
                  </th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">
                    INGREDIENTS
                  </th>
                  <th className="p-3 border-b border-gray-300 bg-gray-200">
                    EARLIEST EXP DATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCurrentMeals.map((meal, index) => (
                  <tr key={index}>
                    <td className="p-3 border-b border-gray-300">
                      {meal.name}
                    </td>
                    <td className="p-3 border-b border-gray-300">
                      {meal.ingredients.join(", ")}
                    </td>
                    <td
                      className={
                        isWithinThreeDays(meal.earliestExpirationDate)
                          ? "p-3 border-b border-gray-300 text-custom-red-200"
                          : "p-3 border-b border-gray-300"
                      }
                    >
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
            <h2 className="text-xl font-bold mb-4 text-center">
              Add Ingredient
            </h2>
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
