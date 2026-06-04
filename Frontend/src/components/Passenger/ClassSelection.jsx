export default function SelectClass({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        border
        rounded
        px-3
        py-2
        text-black
        bg-white
      "
    >
      <option value="Economy">Economy Class</option>
      <option value="Premium Economy">Premium Economy Class</option>
      <option value="Business">Business Class</option>
      <option value="First">First Class</option>
    </select>
  );
}