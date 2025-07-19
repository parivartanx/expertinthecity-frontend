export default function ContactPage() {
  return (
    <div className="max-w-7xl pt-20 mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Contact Us</h1>
      <p className="text-center text-gray-600 mb-12">
        Have questions or need assistance? We’re here to help!
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Cards */}
        <div className="space-y-6">
          <ContactCard
            icon="📧"
            title="Email Us"
            description="For general inquiries and support"
            detail="support@expertinthecity.com"
            link="mailto:support@expertinthecity.com"
          />
          <ContactCard
            icon="📞"
            title="Call Us"
            description="Monday to Friday, 9am to 5pm"
            detail="(555) 123-4567"
            link="tel:5551234567"
          />
          <ContactCard
            icon="📍"
            title="Visit Us"
            description="Our headquarters"
            detail={`123 Main Street\nSuite 456\nNew York, NY 10001`}
          />
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="input" />
              <input
                type="email"
                placeholder="Email Address"
                className="input "
              />
            </div>
            <select className="input">
              <option>Select a subject</option>
              <option>Support</option>
              <option>Business Inquiry</option>
              <option>Others</option>
            </select>
            <textarea
              placeholder="How can we help you?"
              className="input min-h-[100px]"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
          <p className="my-2 ">
            🌟 Ready to take the next step? Reach out now—your journey to growth
            starts with a single message!
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <FAQCard
            question="How quickly will I receive a response?"
            answer="We strive to respond to all inquiries within 24 hours during business days. For urgent matters, please call our customer support line."
          />
          <FAQCard
            question="Can I speak to a specific department?"
            answer="Yes, you can specify the department you'd like to reach in the subject line of your message, and we’ll forward your inquiry to the appropriate team."
          />
        </div>
      </div>
    </div>
  );
}

// Reusable Components
const ContactCard = ({ icon, title, description, detail, link }: any) => (
  <div className="bg-white shadow rounded-lg p-5 text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
    {link ? (
      <a href={link} className="block text-green-600 font-medium mt-1">
        {detail}
      </a>
    ) : (
      <pre className="whitespace-pre-line text-sm text-gray-700 mt-1">
        {detail}
      </pre>
    )}
  </div>
);

const FAQCard = ({ question, answer }: any) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
    <h4 className="font-semibold mb-2">{question}</h4>
    <p className="text-sm text-gray-600">{answer}</p>
  </div>
);
