// app/plans/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Website Building Plans & Pricing',
  description: 'Choose from our Starter, Growth, or Elite custom website plans with transparent pricing and no hidden fees.'
};

// Helper component for feature comparison
function FeatureRow({ feature, starter, growth, elite }) {
  return (
    <tr className="border-b">
      <td className="py-3 px-4 font-medium">{feature}</td>
      <td className="py-3 px-4 text-center">{
        typeof starter === 'boolean' 
          ? (starter ? '✅' : '❌') 
          : starter
      }</td>
      <td className="py-3 px-4 text-center">{
        typeof growth === 'boolean'
          ? (growth ? '✅' : '❌')
          : growth
      }</td>
      <td className="py-3 px-4 text-center">{
        typeof elite === 'boolean'
          ? (elite ? '✅' : '❌')
          : elite
      }</td>
    </tr>
  );
}

export default function PlansPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Website Building Plans</h1>
        <p className="text-xl max-w-3xl mx-auto">
          The perfect pricing structure that makes the third option fully customizable, 
          giving clients the flexibility to create exactly what they need.
        </p>
      </div>

      {/* Mobile pricing cards (visible on small screens) */}
      <div className="md:hidden space-y-8 mb-12">
        {/* Starter Plan Card */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Starter</h2>
          <p className="text-gray-600 mb-2">Best for Personal & Landing Pages</p>
          <p className="text-3xl font-bold mb-4">$150 <span className="text-sm font-normal text-gray-500">one-time</span></p>
          
          <h3 className="font-semibold mt-4 mb-2">What's included:</h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Up to 2 pages</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Simple & clean designs</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Basic SEO optimization</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Standard speed optimization</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Standard security features</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Contact form</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>14 days support</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <span>Mobile-Friendly</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <span>E-commerce features</span>
            </li>
          </ul>
          
          <Link href="/checkout?plan=starter" className="block w-full text-center py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
            Get Started
          </Link>
        </div>

        {/* Growth Plan Card */}
        <div className="border-2 border-blue-500 rounded-lg p-6 shadow-md relative">
          <div className="bg-blue-500 text-white text-sm font-medium py-1 px-4 rounded-br absolute top-0 left-0">
            Best Value
          </div>
          <h2 className="text-2xl font-bold mb-2 mt-4">Growth</h2>
          <p className="text-gray-600 mb-2">Best for Small Businesses & Coaches</p>
          <p className="text-3xl font-bold mb-4">$499 <span className="text-sm font-normal text-gray-500">one-time</span></p>
          
          <h3 className="font-semibold mt-4 mb-2">What's included:</h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Up to 4 pages</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Your custom design</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Advanced SEO optimization</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Mobile-Friendly</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Booking system</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Blog setup</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Optimized speed</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Enhanced security</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>2-3 custom forms</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Basic integrations</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Social media integration</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>FREE logo design</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>30 days support</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <span>E-commerce features</span>
            </li>
          </ul>
          
          <Link href="/checkout?plan=growth" className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>

        {/* Elite Plan Card */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Elite - Custom Website</h2>
          <p className="text-gray-600 mb-2">For Businesses, E-commerce & Advanced Needs</p>
          <p className="text-3xl font-bold mb-1">Custom Pricing</p>
          <p className="text-sm text-blue-600 mb-4">$9.99/month membership</p>
          
          <h3 className="font-semibold mt-4 mb-2">What's included:</h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Unlimited pages</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Fully tailored, unique design</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Full SEO strategy & Google ranking boost</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Mobile-Friendly</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>E-commerce ready (Full online store, automation, memberships)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Advanced booking system & automation</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Full content strategy for blog</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Ultra-fast performance</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Enterprise-grade security</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Fully interactive forms, surveys, and automation</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Full integrations (CRM, automation, analytics)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Social media integration</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>Custom branding & logo design</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>FREE business email setup</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span>FREE domain & hosting (1+ years)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Ongoing support (Retainer options available)</span>
            </li>
          </ul>
          
          <Link href="/consultation" className="block w-full text-center py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
            Get Free Consultation
          </Link>
        </div>
      </div>

      {/* Pricing table (visible on medium and larger screens) */}
      <div className="hidden md:block overflow-x-auto mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-4 text-left"></th>
              <th className="py-4 px-4 text-center">
                <span className="block text-xl font-bold">Starter</span>
                <span className="block text-gray-500 text-sm">Best for Personal & Landing Pages</span>
                <span className="block text-2xl font-bold mt-2">$150</span>
                <span className="block text-gray-500 text-sm">One-time</span>
              </th>
              <th className="py-4 px-4 text-center relative">
                <div className="bg-blue-500 text-white text-xs font-medium py-1 px-2 absolute top-0 left-0 right-0">
                  Best Value
                </div>
                <span className="block text-xl font-bold mt-4">Growth</span>
                <span className="block text-gray-500 text-sm">Best for Small Businesses & Coaches</span>
                <span className="block text-2xl font-bold mt-2">$499</span>
                <span className="block text-gray-500 text-sm">One-time</span>
              </th>
              <th className="py-4 px-4 text-center">
                <span className="block text-xl font-bold">Elite - Custom</span>
                <span className="block text-gray-500 text-sm">For Businesses, E-commerce & Advanced Needs</span>
                <span className="block text-2xl font-bold mt-2">Custom</span>
                <span className="block text-blue-600 text-sm">$9.99/month membership</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <FeatureRow 
              feature="Pages" 
              starter="Up to 2 pages" 
              growth="Up to 4 pages" 
              elite="Unlimited -- Based on Your Needs" 
            />
            <FeatureRow 
              feature="Customization" 
              starter="Simple & clean designs" 
              growth="You Custom design" 
              elite="Fully tailored, unique design" 
            />
            <FeatureRow 
              feature="SEO Optimization" 
              starter="Basic" 
              growth="Advanced" 
              elite="Full SEO strategy & Google ranking boost" 
            />
            <FeatureRow 
              feature="Mobile-Friendly" 
              starter={false} 
              growth={true} 
              elite={true} 
            />
            <FeatureRow 
              feature="E-commerce Ready" 
              starter={false}
              growth={false}
              elite="Full online store, automation, memberships"
            />
            <FeatureRow 
              feature="Booking System" 
              starter={false}
              growth={true}
              elite="Advanced scheduling & automation"
            />
            <FeatureRow 
              feature="Blog Setup" 
              starter={false}
              growth={true}
              elite="Full content strategy"
            />
            <FeatureRow 
              feature="Speed Optimization" 
              starter="Standard"
              growth="Optimized"
              elite="Ultra-fast performance"
            />
            <FeatureRow 
              feature="Security Features" 
              starter="Standard"
              growth="Enhanced"
              elite="Enterprise-grade security (SSL, firewall, backups)"
            />
            <FeatureRow 
              feature="Custom Forms" 
              starter="Contact form"
              growth="2-3 forms"
              elite="Fully interactive forms, surveys, and automation"
            />
            <FeatureRow 
              feature="Integrations (CRM, Payments, etc.)" 
              starter={false}
              growth="Basic Integrations"
              elite="Full Integrations (CRM, automation, analytics)"
            />
            <FeatureRow 
              feature="Social Media Integration" 
              starter={false}
              growth={true}
              elite={true}
            />
            <FeatureRow 
              feature="FREE Logo Design" 
              starter={false}
              growth={true}
              elite="Custom branding & logo design"
            />
            <FeatureRow 
              feature="FREE Business Email Setup" 
              starter={false}
              growth={false}
              elite={true}
            />
            <FeatureRow 
              feature="FREE Domain & Hosting" 
              starter={false}
              growth={false}
              elite="1+ years, premium hosting available"
            />
            <FeatureRow 
              feature="Maintenance & Support" 
              starter="14 days"
              growth="30 days"
              elite="Ongoing (Retainer options available)"
            />
            <tr>
              <td className="py-6 px-4"></td>
              <td className="py-6 px-4 text-center">
                <Link href="/checkout?plan=starter" className="inline-block py-2 px-6 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Get Started
                </Link>
              </td>
              <td className="py-6 px-4 text-center">
                <Link href="/checkout?plan=growth" className="inline-block py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Get Started
                </Link>
              </td>
              <td className="py-6 px-4 text-center">
                <Link href="/consultation" className="inline-block py-2 px-6 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Get Free Consultation
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Special Offer Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">Special Offer!</h2>
        <p className="text-lg mb-6">
          🔥 Sign up today and get a FREE 30-minute website strategy session!
        </p>
        <p className="mb-4">
          <strong>For the Custom-built Elite option:</strong> You will need to sign up for a membership fee of $9.99/month 
          to have access to this service. Cancel any time but not before your project is completed.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <span className="text-green-500 text-2xl mr-3">✅</span>
            <div>
              <h3 className="font-bold mb-2">No Hidden Fees</h3>
              <p>Transparent pricing with everything included. What you see is what you pay.</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 text-2xl mr-3">✅</span>
            <div>
              <h3 className="font-bold mb-2">Fast Turnaround</h3>
              <p>Website delivered in as little as <strong>5-7 days</strong>, depending on complexity.</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 text-2xl mr-3">✅</span>
            <div>
              <h3 className="font-bold mb-2">100% Satisfaction Guarantee</h3>
              <p>We work with you until you're completely satisfied with your website.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Ready to create your perfect website?</h2>
        <Link href="/consultation" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg">
          Let's Start!
        </Link>
      </div>
    </div>
  );
}