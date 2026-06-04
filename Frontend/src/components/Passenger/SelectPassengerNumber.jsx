import { useState, useRef, useEffect } from "react";

export default function Selectnumberofpassenger({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const updatePassenger = (type, delta) => {
    const newPassengers = {
      ...value,
      [type]: Math.max(0, value[type] + delta),
    };

    onChange(newPassengers);
  };

  const getTotal = () =>
    value.adults + value.children + value.infants;

  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative text-black" ref={boxRef}>
      <button
        onClick={() => setOpen(!open)}
        className="border px-4 py-2 rounded bg-white shadow hover:bg-gray-50"
      >
        {getTotal()} passengers
      </button>

      {open && (
        <div className="absolute bg-white border rounded shadow-lg p-4 mt-2 z-20 w-64 text-black">
          <Row
            title="Adults"
            value={value.adults}
            onMinus={() => updatePassenger("adults", -1)}
            onPlus={() => updatePassenger("adults", 1)}
          />

          <Row
            title="Children"
            value={value.children}
            onMinus={() => updatePassenger("children", -1)}
            onPlus={() => updatePassenger("children", 1)}
          />

          <Row
            title="Infants"
            value={value.infants}
            onMinus={() => updatePassenger("infants", -1)}
            onPlus={() => updatePassenger("infants", 1)}
          />
        </div>
      )}
    </div>
  );
}

function Row({ title, value, onMinus, onPlus }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm">{title}</span>

      <div className="flex items-center gap-2">
        <button
          onClick={onMinus}
          className="w-7 h-7 border rounded hover:bg-gray-100"
        >
          -
        </button>

        <span className="w-6 text-center">{value}</span>

        <button
          onClick={onPlus}
          className="w-7 h-7 border rounded hover:bg-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
}