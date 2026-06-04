import { useEffect } from "react";

import Inputflied from "./inputflied.jsx";
import DatePicker from "./datepicker.jsx";
import Country from "./countires.jsx";

export default function PassengerInformation({
  passengers,
  setPassengers,
  passengersCount
}) {

  const totalPassengers =
    (passengersCount?.adults || 0) +
    (passengersCount?.children || 0) +
    (passengersCount?.infants || 0);

 
  useEffect(() => {
    if (totalPassengers > 0) {
      setPassengers(
        Array.from({ length: totalPassengers }, () => ({
          firstname: "",
          lastname: "",
          dateofbirth: "",
          passportNumber: "",
          passportExpiryDate: "",
          nationality: "",
          issuingCountry: "",
        }))
      );
    }
  }, [totalPassengers, setPassengers]);

  // 🟢 HANDLE CHANGE
  const handleChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  return (
    <div className="space-y-6">

      {passengers.map((p, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow space-y-4">

          <h2 className="text-lg font-bold">
            Passenger {index + 1}
          </h2>

          {/* NAME */}
          <div className="grid grid-cols-2 gap-4">
            <Inputflied
              title="First Name"
              value={p.firstname}
              onChange={(val) =>
                handleChange(index, "firstname", val)
              }
            />

            <Inputflied
              title="Last Name"
              value={p.lastname}
              onChange={(val) =>
                handleChange(index, "lastname", val)
              }
            />
          </div>

          {/* DOB + NATIONALITY */}
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              title="Date of Birth"
              value={p.dateofbirth}
              onChange={(val) =>
                handleChange(index, "dateofbirth", val)
              }
            />

            <Country
              title="Nationality"
              value={p.nationality}
              onChange={(val) =>
                handleChange(index, "nationality", val)
              }
            />
          </div>

          {/* PASSPORT */}
          <Inputflied
            title="Passport Number"
            value={p.passportNumber}
            onChange={(val) =>
              handleChange(index, "passportNumber", val)
            }
          />

          {/* EXPIRY */}
          <DatePicker
            title="Passport Expiry Date"
            value={p.passportExpiryDate}
            onChange={(val) =>
              handleChange(index, "passportExpiryDate", val)
            }
          />

          {/* ISSUING COUNTRY */}
          <Country
            title="Issuing Country"
            value={p.issuingCountry}
            onChange={(val) =>
              handleChange(index, "issuingCountry", val)
            }
          />

        </div>
      ))}

    </div>
  );
}