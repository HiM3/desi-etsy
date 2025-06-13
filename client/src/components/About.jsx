import React from 'react';
import { motion } from 'framer-motion';
import { FaHandSparkles, FaHeart, FaUsers, FaLeaf, FaEye } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#d35400] mb-4">
            About DesiEtsy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the beauty of handcrafted treasures, where tradition meets contemporary design.
            We connect skilled artisans with art lovers, preserving cultural heritage one piece at a time.
          </p>
        </motion.div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At DesiEtsy, we're dedicated to preserving and promoting traditional craftsmanship
              while supporting local artisans. Our platform bridges the gap between skilled
              craftsmen and appreciative customers, ensuring that every purchase helps sustain
              cultural heritage.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <FaHandSparkles className="text-[#d35400] mr-2" />
                Preserving traditional craftsmanship
              </li>
              <li className="flex items-center text-gray-600">
                <FaHeart className="text-[#d35400] mr-2" />
                Supporting local artisans
              </li>
              <li className="flex items-center text-gray-600">
                <FaLeaf className="text-[#d35400] mr-2" />
                Promoting sustainable practices
              </li>
            </ul>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-6">
              We envision a world where traditional craftsmanship thrives in the modern marketplace,
              where artisans are valued for their skills, and where consumers appreciate the
              unique stories behind each handcrafted piece.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <FaEye className="text-[#d35400] mr-2" />
                Global recognition for traditional crafts
              </li>
              <li className="flex items-center text-gray-600">
                <FaUsers className="text-[#d35400] mr-2" />
                Thriving artisan communities
              </li>
              <li className="flex items-center text-gray-600">
                <FaHandSparkles className="text-[#d35400] mr-2" />
                Sustainable craft preservation
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-[#d35400] text-4xl mb-4">
              <FaHandSparkles />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Handcrafted Excellence</h3>
            <p className="text-gray-600">
              Each piece is meticulously crafted by skilled artisans using traditional techniques
              passed down through generations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-[#d35400] text-4xl mb-4">
              <FaUsers />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Artisan Community</h3>
            <p className="text-gray-600">
              Join our vibrant community of artisans and customers who appreciate the value of
              handcrafted goods.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-[#d35400] text-4xl mb-4">
              <FaLeaf />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sustainable Practices</h3>
            <p className="text-gray-600">
              We promote eco-friendly materials and sustainable production methods in all our
              handcrafted items.
            </p>
          </div>
        </motion.div>

        {/* Artisan Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Artisans</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Meet the talented craftsmen and women who bring their passion and expertise to
              create unique pieces that tell stories of tradition and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Artisan Cards */}
            <div className="bg-[#fdf8f3] rounded-xl p-6">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="artisan2.jpg"
                  alt="Artisan"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Rajesh Patel</h3>
              <p className="text-gray-600 text-center">
                Master potter with 20 years of experience in traditional ceramic art.
              </p>
            </div>

            <div className="bg-[#fdf8f3] rounded-xl p-6">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="artisan1.jpg"
                  alt="Artisan"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Priya Sharma</h3>
              <p className="text-gray-600 text-center">
                Expert in handloom weaving, creating beautiful textile patterns.
              </p>
            </div>

            <div className="bg-[#fdf8f3] rounded-xl p-6">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="artisan3.jpg"
                  alt="Artisan"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Meena Kumari</h3>
              <p className="text-gray-600 text-center">
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