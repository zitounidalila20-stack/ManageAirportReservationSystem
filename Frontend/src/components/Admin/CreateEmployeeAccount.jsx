import axios from "axios";
import { useState } from "react";
import Inputflied from "../Passenger/inputflied";
import PhoneInput from "../generalcompenents/phonenumberinput";

export default function CreateEmployeeAccount({ onSuccess }) {
  const [employeeData, setEmployeeData] = useState({
    firstname: "",
    lastname: "",
    shift: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  async function handleCreateAccount(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/CreateEmployee", employeeData);
      console.log(response.data);
      
    
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log("ERROR:", err);
    }
  }

  return (
  
    <div className="w-full bg-white flex justify-center items-center">
      <form 
        onSubmit={handleCreateAccount}
        className="w-full max-w-3xl space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">
          Create Employee Account
        </h1>

    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Inputflied
            title="First name"
            value={employeeData.firstname}
            onChange={(value) =>
              setEmployeeData({
                ...employeeData,
                firstname: value,
              })
            }
          />

          <Inputflied
            title="Last name"
            value={employeeData.lastname}
            onChange={(value) =>
              setEmployeeData({
                ...employeeData,
                lastname: value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">
              Select Shift
            </label>
            <select
              value={employeeData.shift}
              onChange={(e) =>
                setEmployeeData({
                  ...employeeData,
                  shift: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 bg-white h-[42px]" // تم ضبط الارتفاع ليتناسق مع الحقول الأخرى
            >
              <option value="">Select shift</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>

          <Inputflied
            title="Email"
            value={employeeData.email}
            onChange={(value) =>
              setEmployeeData({
                ...employeeData,
                email: value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Phone Number</label>
            <PhoneInput
              value={employeeData.phone}
              onChange={(value) =>
                setEmployeeData({
                  ...employeeData,
                  phone: value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={employeeData.password}
              onChange={(e) =>
                setEmployeeData({
                  ...employeeData,
                  password: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 h-[42px]"
            />
          </div>
        </div>

        {/* الصف الرابع: تأكيد كلمة المرور بشكل مستقل أو بجانب زر الإرسال */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              value={employeeData.confirmPassword}
              onChange={(e) =>
                setEmployeeData({
                  ...employeeData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 h-[42px]"
            />
          </div>
        </div>

        {/* زر التثبيت المتناسق والمضيء بخلفية Gradient في المنتصف */}
        <div className="pt-6 flex justify-center">
          <button
            type="submit"
            className="w-full md:w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-semibold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Create Account
          </button>
        </div>

      </form>
    </div>
  );
}