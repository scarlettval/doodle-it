// To be used if we add a drop down menu for art constraints mutliple choice
import React from 'react';

const SelectInput = ({ label, name, value, options, onChange }) => {
  return (
    <div className="select-input">
      <label htmlFor={name}>{label}:</label>
      <select id={name} name={name} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
