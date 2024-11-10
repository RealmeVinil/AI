import React from 'react';
import { Bot, Rss, Globe, Shield } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      title: 'AI-Focused News',
      description: 'Curated news and updates from the world of artificial intelligence, machine learning, and robotics.'
    },
    {
      icon: <Rss className="w-8 h-8 text-blue-600" />,
      title: 'Multiple Sources',
      description: 'Aggregated content from leading AI research institutions, companies, and technology blogs.'
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: 'Real-time Updates',
      description: 'Stay current with the latest developments in AI technology and research.'
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: 'Verified Sources',
      description: 'All news sources are verified and trusted within the AI community.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">About AI News Hub</h2>
        <p className="text-lg text-gray-600">
          Your trusted source for the latest developments in artificial intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              {feature.icon}
              <h3 className="ml-4 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
        <p className="text-gray-700 leading-relaxed">
          AI News Hub is dedicated to keeping you informed about the rapidly evolving world 
          of artificial intelligence. We aggregate news from the most respected sources in 
          the field, ensuring you have access to accurate, timely, and relevant information 
          about AI developments, breakthroughs, and applications.
        </p>
      </div>

      <div className="text-center text-gray-600">
        <p>
          Have questions or suggestions? Contact us at{' '}
          <a href="mailto:contact@ainewshub.com" className="text-blue-600 hover:text-blue-800">
            contact@ainewshub.com
          </a>
        </p>
      </div>
    </div>
  );
}