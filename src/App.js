import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];

function App() {
  const [items, setItems] = useState(initialItems);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item,
      ),
    );
  }

  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all the items?",
    );
    if (confirmed) setItems([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}
function Form({ onAddItems }) {
  const [quantity, setQuantiy] = useState(1);
  const [description, setDescription] = useState("");

  function HandleSubmit(e) {
    e.preventDefault();

    if (!description) return;
    const newItem = { quantity, description, packed: false, id: Date.now() };
    onAddItems(newItem);
    setQuantiy(1);
    setDescription("");
  }
  return (
    <form className="add-form" onSubmit={HandleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantiy(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>ADD</button>
    </form>
  );
}
function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            itemObj={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value={"input"}>Sort by input</option>
          <option value={"description"}>Sort by description</option>
          <option value={"packed"}>Sort by packed</option>
        </select>
        <button onClick={onClearList}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ itemObj, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={itemObj.packed}
        onChange={() => onToggleItem(itemObj.id)}
      />
      <span style={itemObj.packed ? { textDecoration: "line-through" } : {}}>
        {itemObj.quantity}
        {"-"}
        {itemObj.description}
      </span>
      <button onClick={() => onDeleteItem(itemObj.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  if (!items.length) {
    return (
      <footer className="stats">
        <em>Start adding items to your packing list ✈</em>
      </footer>
    );
  }
  const numItems = items.length;
  const itemsPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((itemsPacked / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? `All packed ready to go ✈`
          : `You have ${numItems} items on your list, any you already packed ${itemsPacked}(${percentage}%)`}
      </em>
    </footer>
  );
}
export default App;
