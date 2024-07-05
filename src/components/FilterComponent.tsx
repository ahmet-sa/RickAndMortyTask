
import React from "react";

interface FilterProps {
  title: string;
  options: { value: string; label: string }[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ title, options, selectedOption, onChange }) => {
  return (
    <div className="mb-4">
      <h3>{title}</h3>
      {options.map((option) => (
        <div key={option.value}>
          <label>
            <input
              type="radio"
              name={title.toLowerCase()}
              value={option.value}
              checked={selectedOption === option.value}
              onChange={(e) => onChange(e.target.value)}
            />
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default FilterComponent;
