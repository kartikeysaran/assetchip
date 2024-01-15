import './App.css';
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const inputRef = useRef(null);
  const [selectedChip, setSelectedChip] = useState(null);

  const [items, setItems] = useState([
    '🥑 Avocado',
    '🍌 Banana',
    '🥒 Cucumber',
    '🧼 Detergent',
    '🥚 Eggs',
    '🍚 Flour',
    '🍯 Honey',
    '🍦 Ice Cream',
    '🍓 Jam',
    '🥬 Kale']);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setFilteredItems([]);
    } else {
      const filtered = items.filter(item => item.toLowerCase().includes(value.toLowerCase()));
      setFilteredItems(filtered);
    }
  };

  const handleItemClick = (item) => {
    setChips([...chips, { id: chips.length + 1, label: item }]);
    setItems(items.filter(i => i !== item));
    setFilteredItems([]);
    setInputValue('');
  };

  const handleChipRemove = (id) => {
    const removedChip = chips.find(chip => chip.id === id);
    if (removedChip) {
      setChips(chips.filter(chip => chip.id !== id));
      setItems([...items, removedChip.label]);
      setSelectedChip(null);
    }
  };

  const handleInputKeyDown = (e) => {
    if(e.key === 'Enter' && filteredItems.length > 0) {
      handleItemClick(filteredItems[0]);
    } else if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      if(selectedChip !== null) {
        handleChipRemove(selectedChip.id);
        return;
      }
      const lastChip = chips[chips.length - 1];
      const chipElement = document.getElementById(`chip-${lastChip.id}`);
      if (chipElement) {
        chipElement.classList.add('highlight');
        setSelectedChip(chips[chips.length - 1]);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inputElement = inputRef.current;
      if (inputElement && !inputElement.contains(e.target)) {
        document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('highlight'));
        setSelectedChip(null);
        setFilteredItems([]);
      }
    };
    
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [chips]);

  return (
    <div className="chip-container">
      <div className="chips">
        {chips.map(chip => (
          <div key={chip.id} className="chip" id={`chip-${chip.id}`}>
            {chip.label}
            <button className="remove-button" onClick={() => handleChipRemove(chip.id)}>
              X
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Let's see what we want to order? 🛒"
        onClick={()=>{setFilteredItems(items)}}
      />
      <ul className="item-list">
        {filteredItems.map(item => (
          <li key={item} onClick={() => handleItemClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
