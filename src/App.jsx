import { useEffect, useState } from "react";
import "./App.css";
import Grocery_budget_tracker from "./components/grocery_budget_tracker";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? "app dark" : "app light"} id="body">
      <Grocery_budget_tracker />
    </div>
  );
}
export default App;
