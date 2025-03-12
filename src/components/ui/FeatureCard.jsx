'use client';

const FeatureCard = ({ icon, title, description, color }) => {
  // Define the background color based on the color prop
  const getBgColor = () => {
    switch(color) {
      case 'purple':
        return 'bg-purple-900/20';
      case 'blue':
        return 'bg-blue-900/20';
      case 'orange':
        return 'bg-orange-900/20';
      default:
        return 'bg-purple-900/20';
    }
  };

  // Define the text color based on the color prop
  const getTextColor = () => {
    switch(color) {
      case 'purple':
        return 'text-purple-400';
      case 'blue':
        return 'text-blue-400';
      case 'orange':
        return 'text-orange-400';
      default:
        return 'text-purple-400';
    }
  };
  
  // Define the border color for hover effect
  const getBorderColor = () => {
    switch(color) {
      case 'purple':
        return 'hover:border-purple-500';
      case 'blue':
        return 'hover:border-blue-500';
      case 'orange':
        return 'hover:border-orange-500';
      default:
        return 'hover:border-purple-500';
    }
  };

  const bgColorClass = getBgColor();
  const textColorClass = getTextColor();
  const borderColorClass = getBorderColor();

  return (
    <div className={`feature-card flex flex-col items-center p-6 rounded-xl border border-gray-800 ${borderColorClass} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gray-900`}>
      <div className={`w-16 h-16 flex items-center justify-center ${bgColorClass} ${textColorClass} rounded-full mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 text-center">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;