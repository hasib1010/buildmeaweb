// app/plans/page.jsx
import PlansPageClient from './plans-client';

// Metadata must be exported from the server component (default page component)
export const metadata = {
  title: 'Website Building Plans & Pricing | BUILDMEAWEB',
  description: 'Choose from our Starter, Growth, or Elite custom website plans with transparent pricing and no hidden fees.'
};

export default function PlansPage() {
  // Server component that serves as a wrapper for the client component
  return <PlansPageClient />;
}