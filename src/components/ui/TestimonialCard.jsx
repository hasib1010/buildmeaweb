'use client';

const TestimonialCard = ({ quote, author, role, rating = 5 }) => {
  // Generate star rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-600'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="testimonial-card bg-gray-900 border border-gray-800 hover:border-gray-700 p-6 rounded-xl shadow-sm hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300">
      <div className="text-xl flex mb-4 space-x-1">
        {renderStars()}
      </div>
      <p className="text-gray-300 mb-6 italic">
        "{quote}"
      </p>
      <div className="flex items-center">
        {/* Avatar placeholder - in a real app, this would be a real image */}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
          {author.charAt(0)}
        </div>
        <div>
          <h4 className="font-medium text-white">{author}</h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;