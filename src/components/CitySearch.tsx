import React, { useState, useEffect, useRef } from "react";
import { useSearch } from "../hooks/useWeatherData";
import { type GeoResponse, type CitySearchProps } from "../type";
import "../styles/CitySearch.scss"

function CitySearch({
  onSelect,
  placeholder = "Search for a place...",
}: CitySearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 1100);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data: cities = [], isLoading } = useSearch(debouncedValue);

  useEffect(() => {
    setIsOpen(cities.length > 0 && inputValue.length > 0);
    setSelectedIndex(-1);
  }, [cities, inputValue]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleSelect(place: GeoResponse) {
    const placeName = place.name;
    setInputValue(placeName);
    setIsOpen(false);
    onSelect(place);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex(prev => (prev < cities.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 1));
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && cities[selectedIndex]) {
          handleSelect(cities[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }

  return (
    <section className='search-wrapper'>
      <input
        type='text'
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {isLoading && (
        <div className='search-loading-container'>
          <p>Loading...</p>
        </div>
      )}

      {isOpen && (
        <div className='autocomplete-container'>
          <ul className='keyword-list'>
            {cities.slice(0, 5).map((city, index) => (
              <li
                className="keyword"
                key={`${city.lat}-${city.lon}`}
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {city.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default CitySearch;
