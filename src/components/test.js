import React, { useState } from 'react';

function SelectComponent() {
  const [selectedOption, setSelectedOption] = useState("option1");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label htmlFor="my-select">Choose an option:</label>
      <select id="my-select" value={selectedOption} onChange={handleChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <p>Selected: {selectedOption}</p>
    </div>
  );
}

export default SelectComponent;
