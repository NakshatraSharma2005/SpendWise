import React from 'react';

const testimonials = [
  {
    initials: 'PS',
    name: 'Priya Sharma',
    title: 'Software Engineer',
    review: '"SpendWise has completely transformed how I manage my finances. The AI insights are incredibly accurate and have helped me save over ₹15,000 in just 3 months!"',
    color: 'bg-teal-500'
  },
  {
    initials: 'RK',
    name: 'Rahul Kumar',
    title: 'College Student',
    review: '"As a student on a tight budget, SpendWise helps me track every rupee. The personalized recommendations are spot-on and the interface is so easy to use!"',
    color: 'bg-emerald-500'
  },
  {
    initials: 'AD',
    name: 'Ananya Desai',
    title: 'Marketing Manager',
    review: '"The best expense tracking app I\'ve used! The dashboard is beautiful, insights are actionable, and it\'s helped me stay on top of my financial goals effortlessly."',
    color: 'bg-green-500'
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Thousands</h2>
          <p className="text-slate-400 text-lg">
            See what our users have to say about their experience with SpendWise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-[#1e293b]/60 border border-white/5 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-emerald-400 mb-6 text-xl">
                  ★★★★★
                </div>
                <p className="text-slate-300 leading-relaxed mb-8 text-sm md:text-base">
                  {testimonial.review}
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
                <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]`}>
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.title}</div>
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
