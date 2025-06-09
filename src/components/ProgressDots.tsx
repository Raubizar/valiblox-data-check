interface ProgressDotsProps {
  percentage: number;
  className?: string;
}

export const ProgressDots = ({ percentage, className = "" }: ProgressDotsProps) => {
  // Calculate how many dots should be filled (each dot represents 10%)
  const filledDots = Math.floor(percentage / 10);
  // Check if there's a partial dot (1-9% remaining)
  const hasPartialDot = percentage % 10 > 0;
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Array.from({ length: 10 }, (_, i) => {
        let dotColor = 'bg-gray-200'; // Default empty
        
        if (i < filledDots) {
          dotColor = 'bg-green-500'; // Full dots (10% each)
        } else if (i === filledDots && hasPartialDot) {
          dotColor = 'bg-yellow-500'; // Partial dot (1-9%)
        }
        
        return (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${dotColor} transition-colors duration-300`}
            title={`${(i + 1) * 10}%`}
          />
        );
      })}
      <span className="ml-2 text-sm font-medium text-gray-600">
        {percentage}%
      </span>
    </div>
  );
};
