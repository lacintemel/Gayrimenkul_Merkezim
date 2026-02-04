import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder = '', className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Input;
