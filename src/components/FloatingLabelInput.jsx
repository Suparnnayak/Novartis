import { useState, useRef, useEffect } from 'react';

const FloatingLabelInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setHasValue(value && value.toString().length > 0);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e);
          setHasValue(e.target.value.length > 0);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className="input-premium w-full px-4 pt-6 pb-2 rounded-xl text-gray-800 placeholder-transparent focus:outline-none"
        placeholder={placeholder}
        {...props}
      />
      <label
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          isFocused || hasValue
            ? 'top-2 text-xs font-semibold text-gray-700'
            : 'top-4 text-base text-gray-600'
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
          isFocused ? 'w-full' : 'w-0'
        }`}
      />
    </div>
  );
};

export default FloatingLabelInput;

