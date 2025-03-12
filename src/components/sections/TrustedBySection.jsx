'use client';

const TrustedBySection = () => {
  return (
    <section className="trusted-section py-12 bg-gray-900 border-t border-b border-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl text-gray-400 mb-8">Trusted by innovative businesses</h2>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {/* These would be actual company logos in a real implementation */}
          <div className="trusted-logo w-32 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500">Logo 1</div>
          <div className="trusted-logo w-32 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500">Logo 2</div>
          <div className="trusted-logo w-32 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500">Logo 3</div>
          <div className="trusted-logo w-32 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500">Logo 4</div>
          <div className="trusted-logo w-32 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500">Logo 5</div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;