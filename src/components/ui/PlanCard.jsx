'use client';

import Link from 'next/link';

const PlanCard = ({ 
  name, 
  description, 
  price, 
  period,
  subscription,
  features, 
  isFeatured, 
  ctaText,
  ctaLink,
  ctaStyle
}) => {
  // Determine button style based on props
  const getButtonStyle = () => {
    if (ctaStyle === 'primary') {
      return 'bg-purple-600 hover:bg-purple-700 text-white';
    } else {
      return 'border-2 border-purple-600 text-purple-400 hover:bg-purple-900/20';
    }
  };

  // Determine card style based on whether it's featured
  const cardStyle = isFeatured 
    ? 'border-2 border-purple-600 shadow-md shadow-purple-900/30' 
    : 'border border-gray-800 hover:border-gray-700';

  const buttonStyle = getButtonStyle();

  return (
    <div className={`plan-card bg-gray-900 rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-900/20 ${cardStyle} relative`}>
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-purple-600 text-white text-sm font-bold py-1 px-4 rounded-bl-lg rounded-tr-lg">
          BEST VALUE
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2 text-white">{name}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="text-4xl font-bold mb-1 text-white">{price}</div>
      {period && <span className="text-sm text-gray-400">{period}</span>}
      {subscription && <p className="text-sm text-purple-400 mb-6">{subscription}</p>}
      
      <ul className="space-y-3 mb-8 text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {typeof feature.value === 'boolean' ? (
              <span className={feature.value ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                {feature.value ? '✓' : '✗'}
              </span>
            ) : (
              <span className="text-purple-400 mr-2 text-lg">•</span>
            )}
            <span className="text-gray-300">{feature.text}</span>
          </li>
        ))}
      </ul>
      
      <Link 
        href={ctaLink} 
        className={`block w-full text-center py-3 px-6 rounded-lg font-medium transition-colors ${buttonStyle}`}
      >
        {ctaText}
      </Link>
    </div>
  );
};

export default PlanCard;