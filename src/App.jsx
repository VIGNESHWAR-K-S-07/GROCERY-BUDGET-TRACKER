import { useEffect, useState } from "react";
import "./App.css";
import Grocery_budget_tracker from "./components/grocery_budget_tracker";
import Intro from "./components/Intro";

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
      <div
        className="theme-toggle"
        onClick={() => {
          setIsDarkMode(!isDarkMode);
        }}
      >
        <span className={isDarkMode ? "swipeRight" : "swipeLeft"}>
          {isDarkMode ? "🌞" : "🌙"}
        </span>
      </div>
      <Intro />
      <Grocery_budget_tracker isDarkMode = {isDarkMode}/>
    </div>
  );
}
export default App;
