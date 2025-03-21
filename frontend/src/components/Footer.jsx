import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer container className="border-t-8 border-teal-500 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 py-8">
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start md:space-x-8 space-y-6 md:space-y-0">
          {/* Logo and Branding */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-xl font-semibold">
              Kaul's
            </span>
            <span className="text-xl font-semibold dark:text-white">Blog</span>
          </Link>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-sm md:text-base">
            {/* About Section */}
            <div>
              <Footer.Title title="About" className="text-gray-900 dark:text-gray-200" />
              <Footer.LinkGroup col className="space-y-2">
                <Footer.Link href="https://www.100jsprojects.com" target="_blank" rel="noopener noreferrer">
                  100 JS Projects
                </Footer.Link>
                <Footer.Link href="/about" target="_blank" rel="noopener noreferrer">
                  Kaul's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* Follow Us Section */}
            <div>
              <Footer.Title title="Follow us" className="text-gray-900 dark:text-gray-200" />
              <Footer.LinkGroup col className="space-y-2">
                <Footer.Link href="https://github.com/sahandghavidel" target="_blank" rel="noopener noreferrer">
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* Legal Section */}
            <div>
              <Footer.Title title="Legal" className="text-gray-900 dark:text-gray-200" />
              <Footer.LinkGroup col className="space-y-2">
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Footer.Divider className="my-6 border-gray-300 dark:border-gray-700" />

        {/* Copyright and Social Media */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Footer.Copyright
            href="#"
            by="Kaul's Blog"
            year={new Date().getFullYear()}
            className="text-gray-500 dark:text-gray-400"
          />
          <div className="flex space-x-6 text-gray-600 dark:text-gray-400 text-lg">
            <Footer.Icon href="#" icon={BsFacebook} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
            <Footer.Icon href="#" icon={BsInstagram} className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors" />
            <Footer.Icon href="#" icon={BsTwitter} className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors" />
            <Footer.Icon href="https://github.com/sahandghavidel" icon={BsGithub} className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors" />
            <Footer.Icon href="#" icon={BsDribbble} className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors" />
          </div>
        </div>
      </div>
    </Footer>
  );
}
