import { useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setNames] = useState("");
  const [price, setPrice] =useState("");
  const [quantity, setQuantity] =useState(1);
  const [category, setCategory] =useState("");
  const [showList, setShowlist] =useState(false);

  const categoryList = [
    'VEGETABLES',
    'FRUITS',
    'BEVERAGES',
    'DAIRY',
    'SNACKS',
    'FROZEN FOOD',
    'GRAINS',
    'MEAT',
    'PERSONAL CARE',
    'HOUSEHOLD',
    'SPICES',
    'OTHERS'
  ]
  

  function handleItems(e){
    e.preventDefault();

    if(!name || !category || price <=0 || quantity <=0){
          // alert("Price and Quantity should not be in negative!");
        return;
    }

    if(name && price){
      const newItem = { id: Date.now(),name: name.toUpperCase(),
         price: Number(price),
         quantity:Number(quantity), 
         category: category.toUpperCase()||"Uncategorized"};
      setItems(items.concat(newItem));
      setNames("");
      setPrice("");
      setCategory("");
      setQuantity("");
    }
   

  }

    function removeItems(id){
      const filteredList = items.filter(function(item){
        return item.id !== id;
      });
      setItems(filteredList);
    }

     function clearList() {
      setItems([]);
    }

    let totalAmount = 0;
    for(let i=0; i<items.length; i++){
      totalAmount += parseFloat(items[i].price*items[i].quantity);
    }
    
  return (
    <div>
      <h1>WELCOME TO THE GROCERY BUDGET TRACKER!</h1>
      <h2>Lets track every rupee spend on grocery!</h2>
      <form onSubmit={handleItems}>
        <input type='text'
         placeholder='Item name'
         value={name}  
         onChange={(e) => {
          const value = e.target.value;
          if (/^[A-Za-z\s]*$/.test(value)){
            setNames(value);
          }
         }}/>

        <input type='Number' 
        placeholder='price' 
        value={price}  
        onChange={(e) => setPrice(e.target.value) }
        min={0}/>

        <input type='Number' 
        placeholder='Quantity' 
        value={quantity}  
        onChange={(e) => setQuantity(e.target.value) }
        min={0}/>

        <input type='Text' 
        placeholder='Search Category' 
        value={category}  
        onChange={(e) =>
          setCategory(e.target.value)}
          onClick = {()=> {
            if(name && price > 0 && quantity > 0){
              setShowlist(true);
            }else{
              alert("Please fill the Item Name, Price and Quantity before selecting a Category");}}}
              disabled={!name || price <= 0 || quantity <=0}/>

          {showList && (<ul>
          {categoryList.filter((item) =>
          item.toLowerCase().startsWith(category.toLowerCase())
        )
        .slice(0,5).map((item,index)=>(
          <li
          key={index}
          onClick={()=> {
            setCategory(item);
            setShowlist(false);
          } 
          }
          
          style={{cursor:'pointer',padding:"4px 8px",border:"1px solid #2e2525ff"}}>{item}</li>
        ))}
         </ul>)}
         

        <button type='submit' id='sumbitBtn' >Add items</button>

      </form>
      <h2>Items list:</h2>
      <table
      border={1}
      style={{width:'50%', borderCollapse:'collapse', textAlign:'center'}}>
        <thead>
          <tr>
            <th>Items</th>
            <th>Price</th>            
            <th>Quantity</th>            
            <th>Category</th>            
            <th>Action</th>
          </tr>
        </thead>
        <tbody
        style={{width:'50%', borderCollapse:'collapse',fontWeight:'bolder',textAlign:'center'}}>
          {items.map(function(item){
          return (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={() => {
                return removeItems(item.id);
              }}>Remove</button>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
      
      <h3>Total Budget: Rs {" "}
        {items.reduce(function(total, item){
          return total + (item.price * item.quantity);
        },0)}
      </h3>
      <h2>Total Value : Rs {totalAmount}</h2>
      <button onClick={clearList} id='clearAll'>Clear All</button>
    </div>
  )
}

export default App;
