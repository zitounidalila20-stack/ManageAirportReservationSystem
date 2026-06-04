export default function Inputflied({ title, value, onChange }) {
  function enterLocation(e) {
    onChange?.(e.target.value);
  }

  return (
    <div className="relative w-64">
      
      <input
        id="location"
        type="text"
        value={value}
        onChange={enterLocation}
        placeholder=" "
        className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:outline-none focus:border-blue-500"
      />

      <label
        htmlFor="location"
        className="
          absolute left-3 top-3 text-gray-500
          transition-all duration-200
          cursor-text

          peer-focus:top-1
          peer-focus:text-sm
          peer-focus:text-blue-500

          peer-placeholder-shown:top-3.5
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400

          peer-not-placeholder-shown:top-1
          peer-not-placeholder-shown:text-sm
        "
      >
        {title}
      </label>

    </div>
  );
}