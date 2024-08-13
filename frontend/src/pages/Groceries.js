import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebase/db";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";
import { Clipboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GroceryListGeneration = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const getFavoriteMeals = async () => {
    const uid = auth.currentUser.uid;
    const favoriteMealsCollection = collection(
      db,
      "users",
      uid,
      "favoriteMeals"
    );
    const favoriteMealsSnapshot = await getDocs(favoriteMealsCollection);
    const favoriteMealsList = favoriteMealsSnapshot.docs.map((doc) =>
      doc.data()
    );
    return JSON.stringify(favoriteMealsList);
  };

  const generateGroceryList = useCallback(async (retryCount = 3) => {
    console.log("Generating grocery list...");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCQVb79NBO9crsndXAaV3dPvzSWrqDk0hg"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const json_schema = `[
        {
          "name": "Ingredient Name",
          "quantity": <number>,
          "unit": "unit of measurement"
        }
      ]`;

      const favoriteMealsJson = await getFavoriteMeals();

      const prompt = `Given the following list of favorite meals, please generate a consolidated grocery list with ingredient names, quantities, and units. Combine similar ingredients and adjust quantities accordingly. Only return the response in the JSON schema format ${json_schema}.\n\nFavorite Meals:\n${favoriteMealsJson}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response
        .text()
        .replace(/```|json/gi, "")
        .trim();
      console.log(text);
      const data = JSON.parse(text);

      console.log("Generated grocery list:", data);

      setGroceryList(data);
      setIsLoading(false);
      toast(`Generated grocery list with ${data.length} items`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error generating grocery list:", error);
      if (retryCount > 0) {
        setTimeout(() => generateGroceryList(retryCount - 1), 2000);
      } else {
        setIsLoading(false);
        toast.error(`Error generating grocery list: ${error.message}`, {
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

  const handleCopyList = () => {
    const listText = groceryList
      .map((item) => `${item.name}: ${item.quantity} ${item.unit}`)
      .join("\n");
    navigator.clipboard.writeText(listText).then(
      () => {
        toast.success("Grocery list copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy grocery list", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    );
  };

  useEffect(() => {
    generateGroceryList();
  }, [generateGroceryList]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Generating grocery list...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-montserrat bg-custom-white items-center justify-start">
      <div className="flex h-1/5 justify-center mb-2">
        <img src={logo} alt="Logo" className="h-full" />
      </div>
      <div className="flex flex-col w-1/3 p-5">
        <div className="max-h-[60vh] overflow-y-auto border border-gray-300 bg-gray-100 shadow-md font-mono relative">
          <h1 className="sticky top-0 bg-white p-2 m-0 z-10 text-center font-montserrat font-bold">
            Grocery List
          </h1>
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="p-3 border-b border-gray-300 bg-gray-200">
                  ITEM
                </th>
                <th className="p-3 border-b border-gray-300 bg-gray-200">
                  QTY
                </th>
              </tr>
            </thead>
            <tbody>
              {groceryList.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 border-b border-gray-300 text-left pl-4">
                    {item.name}
                  </td>
                  <td className="p-3 border-b border-gray-300">
                    {item.quantity} {item.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={handleCopyList}
        className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
        title="Copy grocery list"
      >
        <Clipboard size={20} />
      </button>
      <ToastContainer />
    </div>
  );
};

export default GroceryListGeneration;
