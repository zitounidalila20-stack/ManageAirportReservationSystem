import { useState, useEffect, useRef } from "react";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function DatePicker({ value, onChange, title }) {
  const datepickerRef = useRef(null);

  const [state, setState] = useState({
    showDatepicker: false,
    month: 0,
    year: 0,
    noOfDays: [],
    blankDays: [],
  });

  function updateState(newValues) {
    setState(prev => ({ ...prev, ...newValues }));
  }

  useEffect(() => {
    const today = new Date();
    updateState({
      month: today.getMonth(),
      year: today.getFullYear()
    });
  }, []);

  useEffect(() => {
    getNoOfDays();
  }, [state.month, state.year]);

  // ✅ HANDLE CLICK OUTSIDE
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target)
      ) {
        updateState({ showDatepicker: false });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function formatDate(date) {
    let d = ("0" + date.getDate()).slice(-2);
    let m = ("0" + (date.getMonth() + 1)).slice(-2);
    let y = date.getFullYear();
    return `${d}-${m}-${y}`;
  }

  function selectDate(day) {
    const selected = new Date(state.year, state.month, day);
    const formatted = formatDate(selected);

    onChange?.(formatted);

    updateState({
      showDatepicker: false
    });
  }

  function getNoOfDays() {
    let daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    let firstDay = new Date(state.year, state.month).getDay();

    updateState({
      blankDays: Array.from({ length: firstDay }),
      noOfDays: Array.from({ length: daysInMonth }, (_, i) => i + 1),
    });
  }

  function prevMonth() {
    if (state.month === 0) {
      updateState({ month: 11, year: state.year - 1 });
    } else {
      updateState({ month: state.month - 1 });
    }
  }

  function nextMonth() {
    if (state.month === 11) {
      updateState({ month: 0, year: state.year + 1 });
    } else {
      updateState({ month: state.month + 1 });
    }
  }

  return (
    <div ref={datepickerRef} className="w-64 relative">

      {/* INPUT + LABEL */}
      <div className="relative">
        <input
          id="titledate"
          type="text"
          value={value}
          readOnly
          placeholder=" "
          onClick={() =>
            updateState({ showDatepicker: true }) // ✅ better UX
          }
          className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:outline-none focus:border-blue-500 cursor-pointer text-black"
        />

        <label
          htmlFor="titledate"
          className="
            absolute left-3 top-3 text-black
            transition-all duration-200
            cursor-text

            peer-focus:top-1
            peer-focus:text-sm
            peer-focus:text-blue-500

            peer-placeholder-shown:top-3.5
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-black

            peer-not-placeholder-shown:top-1
            peer-not-placeholder-shown:text-sm
          "
        >
          {title}
        </label>
      </div>

      {/* CALENDAR */}
      {state.showDatepicker && (
        <div className="absolute bg-white shadow-md mt-2 p-3 w-full z-10 rounded-md text-black">

          {/* HEADER */}
          <div className="flex justify-between mb-2">
            <button className="text-black" onClick={prevMonth}>◀</button>

            <span className="font-semibold text-black">
              {MONTH_NAMES[state.month]} {state.year}
            </span>

            <button className="text-black" onClick={nextMonth}>▶</button>
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 text-center text-sm text-black">
            {DAYS.map(d => <div key={d}>{d}</div>)}
          </div>

          {/* DATES */}
          <div className="grid grid-cols-7 text-center text-black">
            {state.blankDays.map((_, i) => <div key={i}></div>)}

            {state.noOfDays.map(day => (
              <div
                key={day}
                onClick={() => selectDate(day)}
                className="cursor-pointer hover:bg-blue-200 rounded"
              >
                {day}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}