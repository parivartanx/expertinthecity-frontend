import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white text-black border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-10 text-sm">
        {/* Logo + Description */}
        <div className="space-y-4">
          <div className="text-green-600 font-bold text-2xl">Expert</div>
          <div className="text-sm text-green-600 font-medium">In The City</div>
          <p className="text-gray-700">
            Connect with trusted local service professionals for any job you
            need done.
          </p>
          <div className="flex space-x-3 text-green-600 text-lg">
            <FaFacebookF className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaXTwitter className="cursor-pointer" />
            <FaLinkedinIn className="cursor-pointer" />
            <FaYoutube className="cursor-pointer" />
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-2">Services</h4>
          <ul className="space-y-1 text-gray-700">
            <li>Home Services</li>
            <li>Professional Services</li>
            <li>Health & Wellness</li>
            <li>Events & Entertainment</li>
            <li>Education & Tutoring</li>
          </ul>
        </div>

        {/* Legal & Account */}
        <div>
          <h4 className="font-semibold mb-2">Legal & Account</h4>
          <ul className="space-y-1 text-gray-700">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Login</li>
            <li>Register</li>
            <li>Dashboard</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="space-y-1 text-gray-700">
            <li>About Us</li>
            <li>Contact Us</li>
            <li>FAQ</li>
            <li>Blog</li>
            <li>Support</li>
          </ul>
        </div>

        {/* Join */}
        <div>
          <h4 className="font-semibold mb-2">Join</h4>
          <p className="text-gray-700 mb-2">
            Subscribe to our newsletter for the latest updates and insights.
          </p>
          <div className="flex mb-2">
            <input
              type="email"
              placeholder="Your email here"
              className="border border-gray-300 px-3 py-2 rounded-l w-full outline-none"
            />
            <button className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700">
              Join
            </button>
          </div>
          <p className="text-xs text-gray-600">
            By joining, you consent to our{" "}
            <span className="text-green-600 cursor-pointer">
              Privacy Policy
            </span>{" "}
            and receive updates.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t text-sm text-gray-600 py-4 px-4 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <p>© 2024 ExpertInTheCity. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0 text-green-600">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className="cursor-pointer">Terms of Use</span>
          <span className="cursor-pointer">Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
