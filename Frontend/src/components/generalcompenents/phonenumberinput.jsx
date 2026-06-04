import { useState, useRef, useEffect } from "react";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

// COUNTRIES SETUP
let countries = getCountries()
  .filter((c) => c !== "IL")
  .map((c) => ({
    code: c,
    dial: "+" + getCountryCallingCode(c),
    name: new Intl.DisplayNames(["en"], {
      type: "region",
    }).of(c),
    flag: `https://flagcdn.com/w40/${c.toLowerCase()}.png`,
  }));

countries = [
  {
    code: "PS",
    dial: "+970",
    name: "Palestine",
    flag: "https://flagcdn.com/w40/ps.png",
  },
  ...countries,
];

export default function PhoneInput({
  value = "",
  onChange,
}) {

  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === "DZ") ||
      countries[0]
  );

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [isValid, setIsValid] = useState(null);

  const wrapperRef = useRef(null);

  // CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {

    function handleClickOutside(e) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // PHONE VALIDATION
  useEffect(() => {

    if (!value) {
      setIsValid(null);
      return;
    }

    const fullPhone =
      selectedCountry.dial + value;

    const parsed =
      parsePhoneNumberFromString(
        fullPhone,
        selectedCountry.code
      );

    if (parsed && parsed.isValid()) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }

  }, [value, selectedCountry]);

  // FILTER COUNTRIES
  const filteredCountries = countries.filter(
    (c) =>
      c.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  return (
    <div
      ref={wrapperRef}
      className="relative w-full space-y-2"
    >

      {/* LABEL */}
      <label className="text-sm text-gray-600">
        Phone Number
      </label>

      {/* INPUT CONTAINER */}
      <div
        className={`
          flex overflow-hidden rounded-md border

          ${
            isValid === true
              ? "border-green-500"
              : ""
          }

          ${
            isValid === false
              ? "border-red-500"
              : ""
          }
        `}
      >

        {/* COUNTRY SELECTOR */}
        <div
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-2
            px-3
            bg-gray-50
            border-r
            cursor-pointer
            min-w-fit
          "
        >

          <img
            src={selectedCountry.flag}
            alt={selectedCountry.name}
            className="w-5 h-4 object-cover rounded-sm"
          />

          <span className="text-sm font-medium">
            {selectedCountry.dial}
          </span>

        </div>

        {/* PHONE INPUT */}
        <input
          type="tel"
          value={value}
          onChange={(e) => {

            const cleaned =
              e.target.value.replace(/\D/g, "");

            onChange?.(cleaned);

          }}
          placeholder="Phone number"
          className="
            flex-1
            px-3
            py-2
            outline-none
          "
        />

      </div>

      {/* VALIDATION MESSAGE */}
      {isValid === true && (
        <p className="text-xs text-green-600">
          Valid phone number
        </p>
      )}

      {isValid === false && (
        <p className="text-xs text-red-500">
          Invalid phone number
        </p>
      )}

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute
            z-20
            w-full
            bg-white
            border
            rounded-md
            shadow-lg
            max-h-60
            overflow-auto
          "
        >

          {/* SEARCH */}
          <input
            autoFocus
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search country..."
            className="
              w-full
              px-3
              py-2
              border-b
              outline-none
              text-sm
            "
          />

          {/* COUNTRIES */}
          {filteredCountries.map((c) => (
            <div
              key={c.code}
              onClick={() => {
                setSelectedCountry(c);
                setOpen(false);
                setSearch("");
              }}
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                hover:bg-gray-100
                cursor-pointer
              "
            >

              <img
                src={c.flag}
                alt={c.name}
                className="w-5 h-4 object-cover rounded-sm"
              />

              <span className="text-sm">
                {c.name} ({c.dial})
              </span>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}