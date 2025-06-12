import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaEnvelope, FaPhone, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gradient-to-b from-[#fbe9e7] to-[#ffccbc] text-[#6e2c00] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
        >
          {/* About Section */}
          <motion.div
            className="flex flex-col gap-4"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-[#d35400] relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-[#d35400]">
              About DesiEtsy
            </h3>
            <p className="text-sm leading-relaxed text-[#6e2c00]/80">
              Empowering artisans and connecting them with customers who appreciate handmade, authentic products.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="flex flex-col gap-4"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-[#d35400] relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-[#d35400]">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3">
              {['About Us', 'Contact Us', 'FAQ', 'Shipping Policy', 'Returns & Refunds'].map((link, index) => (
                <motion.a
                  key={index}
                  href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm hover:text-[#d35400] transition-all duration-300 flex items-center gap-2 group"
                  whileHover={{ x: 5 }}
                >
                  <FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            className="flex flex-col gap-4"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-[#d35400] relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-[#d35400]">
              Categories
            </h3>
            <div className="flex flex-col gap-3">
              {[
                'Handmade Jewelry',
                'Clay Pots',
                'Jute Bags',
                'Paintings',
                'Textiles'
              ].map((category, index) => (
                <motion.a
                  key={index}
                  href={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm hover:text-[#d35400] transition-all duration-300 flex items-center gap-2 group"
                  whileHover={{ x: 5 }}
                >
                  <FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {category}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            className="flex flex-col gap-4"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-[#d35400] relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-[#d35400]">
              Connect With Us
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:support@desietsy.com"
                className="text-sm hover:text-[#d35400] transition-all duration-300 flex items-center gap-2 group"
              >
                <FaEnvelope className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                support@desietsy.com
              </a>
              <a
                href="tel:+911234567890"
                className="text-sm hover:text-[#d35400] transition-all duration-300 flex items-center gap-2 group"
              >
                <FaPhone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                +91 1234567890
              </a>
            </div>
            <div className="flex gap-4 mt-2">
              {[
                { icon: FaFacebook, url: 'https://facebook.com' },
                { icon: FaInstagram, url: 'https://instagram.com' },
                { icon: FaTwitter, url: 'https://twitter.com' },
                { icon: FaPinterest, url: 'https://pinterest.com' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6e2c00] hover:text-[#d35400] transition-all duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-12 pt-8 border-t border-[#6e2c00]/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-sm text-[#6e2c00]/80">
            © {currentYear} DesiEtsy. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 