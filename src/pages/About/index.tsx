import React from 'react';

function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="min-h-screen max-w-[1400px] mx-auto p-8 shadow-lg rounded-lg">
        <h1 className="text-4xl font-semibold text-white mb-6 text-left">About AppGuard</h1>

        <section className="mb-6">
          <h2 className="text-3xl font-bold text-gray-300 mb-2">Introduction</h2>
          <p className="text-lg text-gray-200">
            AppGuard is an innovative application designed to help users manage their app usage effectively. 
            In a world filled with distractions, we empower you to regain control over your time. With AppGuard, 
            you can set specific time restrictions on applications, allowing for a more balanced digital lifestyle.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-3xl font-bold text-gray-300 mb-2">Our Mission</h2>
          <p className="text-lg text-gray-200">
            Our mission is to empower users to take control of their digital habits and promote healthier app usage. 
            We believe in fostering a balanced relationship with technology, helping users prioritize their time 
            and well-being. By creating awareness about app usage patterns, we aim to enhance productivity and mental health.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-3xl font-bold text-gray-300 mb-2">Features</h2>
          <ul className="list-disc list-inside text-lg text-gray-200">
            <li>Set custom time limits for each app.</li>
            <li>Receive notifications when usage time is about to end.</li>
            <li>Intuitive user interface for easy navigation.</li>
            <li>Track app usage statistics to monitor habits.</li>
            <li>Daily, weekly, and monthly usage reports.</li>
            <li>Customizable settings to tailor notifications.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-3xl font-bold text-gray-300 mb-2">Why Choose AppGuard?</h2>
          <p className="text-lg text-gray-200">
            In today’s fast-paced world, its easy to lose track of time while using applications. 
            AppGuard is designed to help you recognize when its time to take a break. 
            By implementing usage restrictions, users can enjoy their favorite apps while maintaining a healthy lifestyle.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-300 mb-2">Contact Us</h2>
          <p className="text-lg text-gray-200">
            We’d love to hear from you! If you have any questions, feedback, or suggestions, please reach out to us at:
          </p>
          <p className="text-lg text-gray-200">
            <a href="mailto:support@appguard.com" className="text-blue-400 hover:underline">support@appguard.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
