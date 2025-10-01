// src/components/Testimonials.jsx
import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Microsoft",
      image: "👩‍💻",
      testimonial: "Global Connect helped me transition from a junior developer to a senior engineer. The networking opportunities are incredible!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Director at Google",
      image: "👨‍💼",
      testimonial: "I've built meaningful professional relationships and found amazing career opportunities through this platform.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Product Manager at Amazon",
      image: "👩‍💼",
      testimonial: "The real-time messaging feature made it easy to connect with industry leaders and mentors. Highly recommended!",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <span key={i} className="text-yellow-400">⭐</span>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-50 to-blue-100">
      <div className="container 2xl:px-20 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from professionals who transformed their careers with Global Connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="text-slate-700 text-4xl mb-4">"</div>
              
              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                {testimonial.testimonial}
              </p>
              
              {/* Rating */}
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              {/* User Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-700 to-teal-700 rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;