import React from "react";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../components_css/grocery_budget_tracker.css";

const Grocery_budget_tracker = () => {
  const [isListEmpty, setIsListEmpty] = useState(true);
  const [items, setItems] = useState([]);
  const [name, setNames] = useState("");
  const [price, setPrice] = useState("");
  const [Weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [showList, setShowlist] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [editItem, setEditItem] = useState(null);
  const categoryList = [
    "VEGETABLES",
    "FRUITS",
    "BEVERAGES",
    "DAIRY",
    "SNACKS",
    "FROZEN FOOD",
    "GRAINS",
    "MEAT",
    "PERSONAL CARE",
    "HOUSEHOLD",
    "SPICES",
    "OTHERS",
  ];
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

  // To Add an item in the List

  function handleItems(e) {
    e.preventDefault();

    // Validate the inputs are given

    if (
      !name ||
      !category ||
      !Weight ||
      !weightUnit ||
      price <= 0 ||
      quantity <= 0
    ) {
      setErrorMessage("Please fill the Fields with correct inputs!!!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (name && price) {
      const newItem = {
        id: Date.now(),
        name: name.toUpperCase(),
        price: Number(price),
        Weight: Number(Weight),
        weightUnit: weightUnit,
        quantity: Number(quantity),
        category: String(category).toUpperCase() || "Uncategorized",
      };
      setItems(items.concat(newItem));
      setNames("");
      setPrice("");
      setWeight("");
      setWeightUnit("");
      setCategory("");
      setQuantity("");
      setIsListEmpty(false);
      setSuccessMessage("The Item Added Sucessfully :)");
      setTimeout(() => setSuccessMessage(""), 3000);
    }

    if (editItem !== null) {
      const updatedItem = items.map((item) =>
        item.id === editItem
          ? { ...item, name, price, Weight, weightUnit, quantity, category }
          : item,
      );
      setItems(updatedItem);
      setEditItem(null);
    }
  }

  // Function that handles the remove an item from the list
  function removeItems(id) {
    const filteredList = items.filter(function (item) {
      return item.id !== id;
    });
    setItems(filteredList);
  }

  // Function that modifies an item from the list

  function handleEdit(id) {
    const itemToedit = items.find((item) => item.id === id);
    setNames(itemToedit.name);
    setPrice(itemToedit.price);
    setWeight(itemToedit.Weight);
    setWeightUnit(itemToedit.weightUnit);
    setQuantity(itemToedit.quantity);
    setCategory(itemToedit.category);
    setEditItem(id);
  }

  // Function that helps to clear the list

  function clearList() {
    setItems([]);
    setIsListEmpty(true);
  }

  const downloadPdf = () => {
    const table = document.getElementById("grocery-table");
    html2canvas(table, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 20, imgWidth, imgHeight);
      pdf.save("Your grocery-List.pdf");
    });
  };

  // Sum the total amount in the list
  let totalAmount = 0;
  for (let i = 0; i < items.length; i++) {
    totalAmount += parseFloat(items[i].price * items[i].quantity);
  }
  //   console.log(items);
  return (
    <div className={isDarkMode ? "app dark" : "app light"} id="body">
      <div className="main-container">
        <div
          className="theme-toggle"
          onClick={() => {
            setIsDarkMode(!isDarkMode);
          }}
        >
          <span className={isDarkMode ? "swipeRight" : "swipeLeft"}>{isDarkMode ? "🌞" : "🌙"}</span>
        </div>
        <h1>WELCOME TO THE GROCERY BUDGET TRACKER!</h1>
        <h2>Lets track every rupee spend on grocery!</h2>
        {/* FORM STARTS */}
        <form onSubmit={handleItems} className="input-form">
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[A-Za-z\s]*$/.test(value)) {
                setNames(value);
              }
            }}
          />

          <input
            type="number"
            placeholder="Weight"
            value={Weight}
            onChange={(e) => {
              setWeight(e.target.value);
            }}
          />
          <select
            className="weightUnit-dropdown"
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
          >
            <option value="">select Unit</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">l</option>
            <option value="ml">ml</option>
          </select>

          <input
            type="Number"
            placeholder="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
          />

          <input
            type="Number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={0}
          />

          <input
            type="Text"
            placeholder="Search Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onClick={() => {
              if (name && price > 0 && quantity > 0) {
                setShowlist(true);
                setErrorMessage([]);
              } else {
                setErrorMessage(
                  "Please fill the Item Name, Price and Quantity before selecting a Category!",
                );
                setTimeout(() => setErrorMessage(""), 3000);
              }
            }}
            disabled={!name || price < 0 || quantity < 0}
          />

          {showList && (
            <ul className="drop-downList">
              {categoryList
                .filter((item) =>
                  item.toLowerCase().startsWith(category.toLowerCase()),
                )
                .slice(0, 5)
                .map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setCategory(item);
                      setShowlist(false);
                    }}
                    style={{
                      cursor: "pointer",
                      padding: "4px 8px",
                      border: "1px solid #2e2525ff",
                    }}
                  >
                    {item}
                  </li>
                ))}
            </ul>
          )}

          <button type="submit" id="sumbitBtn">
            Add items
          </button>
          {SuccessMessage && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              {SuccessMessage}
            </p>
          )}

          {errorMessage && (
            <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
          )}
        </form>
        {/* FORM ENDS */}
        <h2>Items list:</h2>
        <div className="table-container">
          <table
            id="grocery-table"
            border={1}
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th>Items</th>
                <th>Price</th>
                <th>Weight in Kg / Ml</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody
              style={{
                width: "50%",
                borderCollapse: "collapse",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {items.map(function (item) {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.Weight}
                      {item.weightUnit}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.price * item.quantity}</td>
                    <td>{item.category}</td>
                    <td>
                      <button
                        className="Delete-btn"
                        onClick={() => {
                          return removeItems(item.id);
                        }}
                      >
                        Delete
                      </button>
                      <FaTrash
                        className="deleteIcon"
                        onClick={() => {
                          return removeItems(item.id);
                        }}
                      />
                    </td>
                    <td>
                      <button
                        className="Edit-btn"
                        onClick={() => {
                          return handleEdit(item.id);
                        }}
                      >
                        Edit
                      </button>
                      <FaEdit
                        className="editIcon"
                        onClick={() => {
                          return handleEdit(item.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3>
          Total Budget: Rs{" "}
          {items.reduce(function (total, item) {
            return total + item.price * item.quantity;
          }, 0)}
        </h3>
        <h2>Total Value : Rs {totalAmount}</h2>
        <button onClick={clearList} id="clearAll">
          Clear All
        </button>
        {isListEmpty ? (
          ""
        ) : (
          <>
            <h3>click here to download your list!</h3>
            <button className="Download-btn" onClick={downloadPdf}>
              Download as PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Grocery_budget_tracker;
