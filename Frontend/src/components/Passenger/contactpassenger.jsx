import Inputflied from "./inputflied.jsx";
import PhoneInput from "../generalcompenents/phonenumberinput.jsx";

export default function ContactInformation({ contact, setContact }) {

  const handleChange = (field, value) => {
    setContact((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">

      <h2 className="text-xl font-bold">Contact Information</h2>

      <Inputflied
        title="Email"
        value={contact.email}
        onChange={(val) => handleChange("email", val)}
      />

      <PhoneInput
        value={contact.phoneNumber}
        onChange={(val) => handleChange("phoneNumber", val)}
      />

    </div>
  );
}