import React, { useState } from 'react';

function DatePicker() {
  const [selectedDate, setSelectedDate] = useState("");

  // Convert YYYY-MM-DD to DD/MM/YYYY
  const formatToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD
  const formatToYYYYMMDD = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (event) => {
    // Store the date in YYYY-MM-DD format
    setSelectedDate(event.target.value);
  };

  return (
    <div>
      <label htmlFor="datePicker">Select a date: </label>
      <input
        type="date"
        id="datePicker"
        value={selectedDate}
        onChange={handleChange}
      />
      <p>Selected Date: {formatToDDMMYYYY(selectedDate)}</p>
    </div>
  );
}

export default DatePicker;
