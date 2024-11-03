import React from 'react';

const Step = ({ number, label, isActive, isCompleted }) => {
    return (
        <div className="flex items-center mb-[25px]">
            <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted ? 'bg-[#2f19ae]' : 'bg-gray-300'
                } ${isActive ? 'text-white' : 'text-gray-500'}`}
            >
                {isCompleted ? <i className="fas fa-check"></i> : number}
            </div>
            <span className={`ml-2 ${isActive || isCompleted ? 'text-black' : 'text-gray-500'}`}>{label}</span>
            <div className="flex-1 border-t border-gray-300 mx-4"></div>
        </div>
    );
};

const ProgressBar = ({ currentStep }) => {
    const steps = [
        { label: 'Login', isActive: currentStep === 0, isCompleted: currentStep > 0 },
        { label: 'Delivery Address', isActive: currentStep === 1, isCompleted: currentStep > 1 },
        { label: 'Order Summary', isActive: currentStep === 2, isCompleted: currentStep > 2 },
        { label: 'Payment', isActive: currentStep === 3, isCompleted: currentStep > 3 },
    ];

    return (
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto mt-10">
            {steps.map((step, index) => (
                <Step
                    key={index}
                    number={index + 1}
                    label={step.label}
                    isActive={step.isActive}
                    isCompleted={step.isCompleted}
                />
            ))}
        </div>
    );
};

export default ProgressBar;
