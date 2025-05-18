import React from "react";

const steps = [
  {
    number: "1",
    title: "Tell us what you need",
    desc: "Answer a few questions about the service you’re looking for and we’ll match you with the right experts.",
  },
  {
    number: "2",
    title: "Compare quotes",
    desc: "Receive free quotes from verified local professionals and compare their rates, reviews, and qualifications.",
  },
  {
    number: "3",
    title: "Hire the best expert",
    desc: "Choose the professional that best fits your needs and budget, then book and pay securely through our platform.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#f4f8fc] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          How <span className="text-green-600 font-bold">ExpertInTheCity</span>{" "}
          Works
        </h2>
        <p className="text-gray-500 text-md md:text-lg mb-12">
          Finding the right service professional has never been easier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-4 px-4">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
                {step.number}
              </div>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
