const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`spinner ${sizeClasses[size]}`}
        style={{
          border: `3px solid rgba(255, 255, 255, 0.3)`,
          borderTopColor: '#667eea',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;

