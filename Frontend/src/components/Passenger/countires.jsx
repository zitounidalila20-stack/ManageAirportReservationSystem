import { useState, useEffect, useRef } from "react";

const CountrySelect = ({ value, onChange, title = "Country" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef(null);

  // Fetch countries
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const formatted = data.map((c) => ({
          name: c.name.common,
          code: c.cca2,
          flag: c.flags.png,
        }));
        formatted.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(formatted);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load countries");
        setLoading(false);
      });
  }, []);

  // close outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country) => {
    onChange(country);   
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="max-w-md mx-auto" ref={dropdownRef}>
      <label className="block mb-1 text-gray-600">{title}</label>

      <div
        onClick={() => setIsOpen(true)}
        className="h-12 bg-white flex border border-gray-200 rounded items-center cursor-pointer"
      >
        <div className="px-4 flex items-center gap-3 w-full">

          {value?.flag && (
            <img
              src={value.flag}
              className="w-6 h-4 object-cover rounded-sm"
              alt=""
            />
          )}

          <input
            type="text"
            className="w-full outline-none"
            placeholder={
              value?.name || (loading ? "Loading..." : "Search country...")
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {isOpen && !loading && (
        <div className="absolute z-50 bg-white border w-full max-h-64 overflow-y-auto">
          {filteredCountries.map((country) => (
            <div
              key={country.code}
              onClick={() => handleSelect(country)}
              className="p-2 flex gap-2 hover:bg-blue-50 cursor-pointer"
            >
              <img src={country.flag} className="w-6 h-4" />
              <span>{country.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelect;