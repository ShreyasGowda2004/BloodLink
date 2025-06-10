import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'} pt-12 pb-8`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About BloodLink</h3>
            <p className="mb-4">
              BloodLink is a platform dedicated to connecting blood donors with those in need, 
              making the donation process easier and more accessible for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-red-600 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-red-600 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-red-600 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-red-600 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-red-600 transition-colors">Become a Donor</Link>
              </li>
              <li>
                <Link to="/request" className="hover:text-red-600 transition-colors">Request Blood</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-red-600 transition-colors">Login</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-red-600 transition-colors">Donation Guidelines</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition-colors">Blood Types</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition-colors">Blog</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2">BloodLink</p>
              <p>Owner: Shreyas Gowda</p>
              <p className="mb-2">BMS Institute of Technology and Management</p>
              <p className="mb-2">Doddaballapur Main Rd, Avalahalli, Yelahanka</p>
              <p className="mb-2">Bengaluru, Karnataka, India, 560064</p>
              <p className="mb-2">Email: <a href="mailto:shreyasgowda1901@gmail.com" className="hover:text-red-600">shreyasgowda1901@gmail.com</a></p>
              <p className="mb-2">Phone: <a href="tel:+916361943681" className="hover:text-red-600">+9163619436891</a></p>
              
              
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} BloodLink. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center">
            Made with <FaHeart className="mx-1 text-red-600" /> for a better world
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;