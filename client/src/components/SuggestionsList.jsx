import React from 'react';

const SuggestionsList = ({ suggestions, handleSelectSuggestion, setSource, setSourceDisplay }) => {
  return (
    <ul className=" bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-auto left-0">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => handleSelectSuggestion(suggestion, setSource, setSourceDisplay)}
          className="p-2 hover:bg-gray-100 cursor-pointer"
        >
          {suggestion.name}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;