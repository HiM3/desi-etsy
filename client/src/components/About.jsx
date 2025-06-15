import React from 'react';
import { motion } from 'framer-motion';
import { FaHandSparkles, FaHeart, FaUsers, FaLeaf, FaEye } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-16 sm:pt-24 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#d35400] mb-3 sm:mb-4">
            About DesiEtsy
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Discover the beauty of handcrafted treasures, where tradition meets contemporary design.
            We connect skilled artisans with art lovers, preserving cultural heritage one piece at a time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Our Mission</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              At DesiEtsy, we're dedicated to preserving and promoting traditional craftsmanship
              while supporting local artisans. Our platform bridges the gap between skilled
              craftsmen and appreciative customers, ensuring that every purchase helps sustain
              cultural heritage.
            </p>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center text-sm sm:text-base text-gray-600">
                <FaHandSparkles className="text-[#d35400] mr-2 flex-shrink-0" />
                Preserving traditional craftsmanship
              </li>
              <li className="flex items-center text-sm sm:text-base text-gray-600">
                <FaHeart className="text-[#d35400] mr-2 flex-shrink-0" />
                Supporting local artisans
              </li>
              <li className="flex items-center text-sm sm:text-base text-gray-600">
                <FaLeaf className="text-[#d35400] mr-2 flex-shrink-0" />
                Promoting sustainable practices
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Our Vision</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              We envision a world where traditional craftsmanship thrives in the modern marketplace,
              where artisans are valued for their skills, and where consumers appreciate the
              unique stories behind each handcrafted piece.
            </p>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center text-sm sm:text-base text-gray-600">
                <FaEye className="text-[#d35400] mr-2 flex-shrink-0" />
                Global recognition for traditional crafts
              </li>
              <li className="flex items-center text-sm sm:text-base text-gray-600">
                <FaUsers className="text-[#d35400] mr-2 flex-shrink-0" />
                Thriving artisan communities
              </li>
              <li className="flex items-center text-sm sm:text-base text-gray-600">
                <FaHandSparkles className="text-[#d35400] mr-2 flex-shrink-0" />
                Sustainable craft preservation
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-16"
        >
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="text-[#d35400] text-3xl sm:text-4xl mb-3 sm:mb-4">
              <FaHandSparkles />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Handcrafted Excellence</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Each piece is meticulously crafted by skilled artisans using traditional techniques
              passed down through generations.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="text-[#d35400] text-3xl sm:text-4xl mb-3 sm:mb-4">
              <FaUsers />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Artisan Community</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Join our vibrant community of artisans and customers who appreciate the value of
              handcrafted goods.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="text-[#d35400] text-3xl sm:text-4xl mb-3 sm:mb-4">
              <FaLeaf />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Sustainable Practices</h3>
            <p className="text-sm sm:text-base text-gray-600">
              We promote eco-friendly materials and sustainable production methods in all our
              handcrafted items.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Our Artisans</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Meet the talented craftsmen and women who bring their passion and expertise to
              create unique pieces that tell stories of tradition and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-[#fdf8f3] rounded-xl p-4 sm:p-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-3 sm:mb-4">
                <img
                  src="artisan2.jpg"
                  alt="Artisan"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-2">Rajesh Patel</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                Master potter with 20 years of experience in traditional ceramic art.
              </p>
            </div>

            <div className="bg-[#fdf8f3] rounded-xl p-4 sm:p-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-3 sm:mb-4">
                <img
                  src="artisan1.jpg"
                  alt="Artisan"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-2">Priya Sharma</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                Expert in handloom weaving, creating beautiful textile patterns.
              </p>
            </div>

            <div className="bg-[#fdf8f3] rounded-xl p-4 sm:p-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-3 sm:mb-4">
                <img
                  src="artisan3.jpg"
                  alt="Artisan"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-2">Meena Kumari</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                Skilled woodworker specializing in traditional furniture making.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;