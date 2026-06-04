export default function ProgressBar({ currentStep }) {
  const steps = [
    "Personal Details",
    "Seats",
    "Payment",
    "Confirmation",
  ];

  return (
    <div className="max-w-3xl mx-auto my-6 px-4">
      {/* Steps */}
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div key={step} className="flex items-center flex-1">
              {/* Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "border-2 border-green-500 text-green-500 bg-white"
                        : "border-2 border-gray-300 text-gray-500 bg-white"
                    }
                  `}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>

                {/* Label */}
                <p
                  className={`
                    mt-2 text-xs text-center
                    ${
                      isCurrent
                        ? "text-green-600 font-semibold"
                        : "text-gray-500"
                    }
                  `}
                >
                  {step}
                </p>
              </div>

              {/* Line */}
              {index !== steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 rounded bg-gray-200">
                  <div
                    className={`h-1 rounded transition-all duration-300 ${
                      currentStep > stepNumber
                        ? "w-full bg-green-500"
                        : "w-0 bg-green-500"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}