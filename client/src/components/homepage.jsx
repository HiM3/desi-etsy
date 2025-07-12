import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import banner1 from '../components/Slider-Images/combine.jpg';
import banner2 from '../components/Slider-Images/combine2.jpg';
import banner3 from '../components/Slider-Images/combine3.jpg';

const HomePage = () => {
  const slides = [
    {
      img: banner1,
      title: "Discover Handcrafted Treasures",
      subtitle: "Support local artisans and bring home unique pieces of art"
    },
    {
      img: banner2,
      title: "Empowering Rural Artisans",
      subtitle: "Every purchase makes a difference in their lives"
    },
    {
      img: banner3,
      title: "Authentic Handmade Products",
      subtitle: "Crafted with love and traditional techniques"
    }
  ];

  const sliderSettings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all duration-300" />
    )
  };

  const categories = [
    { name: "Handmade Jewelry", img: "5.jpg", description: "Unique pieces crafted with love" },
    { name: "Clay Pots", img: "2.jpg", description: "Traditional pottery with modern designs" },
    { name: "Jute Bags", img: "7.jpg", description: "Eco-friendly fashion accessories" },
    { name: "Paintings", img: "6.jpg", description: "Art that tells stories" }
  ];

  const featuredProducts = [
    { name: "Handcrafted Necklace", price: "$45", img: "Necklace.jpg" },
    { name: "Ceramic Vase", price: "$35", img: "1.jpg" },
    { name: "Jute Tote Bag", price: "$25", img: "4.jpg" },
    { name: "Wall Painting", price: "$120", img: "Wall_Painting.jpg" }
  ];

  const artisans = [
    {
      name: "Priya Sharma",
      image: "artisan1.jpg",
      bio: "Master jewelry maker with 15 years of experience"
    },
    {
      name: "Rajesh Patel",
      image: "artisan2.jpg",
      bio: "Traditional potter preserving ancient techniques"
    },
    {
      name: "Meena Kumari",
      image: "artisan3.jpg",
      bio: "Expert weaver creating beautiful jute products"
    }
  ];

  const testimonials = [
    {
      text: "The quality of products is exceptional. Each piece tells a story of our rich cultural heritage.",
      author: "Sarah Johnson"
    },
    {
      text: "I love knowing that my purchase directly supports these talented artisans. The craftsmanship is outstanding.",
      author: "Michael Chen"
    },
    {
      text: "These handmade products bring so much character to my home. Truly unique pieces!",
      author: "Priya Patel"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative w-full overflow-hidden">
        <Slider {...sliderSettings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative h-[60vh] xs:h-[70vh] sm:h-[85vh] w-full">
              <img
                src={slide.img}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute top-1/2 left-[5%] xs:left-[8%] sm:left-[10%] -translate-y-1/2 text-white max-w-[90vw] sm:max-w-[700px] z-10 px-2 xs:px-4 sm:px-6 lg:px-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-shadow-lg"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg sm:text-xl mb-6 sm:mb-10 text-shadow-lg"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                >
                  <NavLink
                    to="/product"
                    className="group bg-[#d35400] text-white px-6 sm:px-10 py-3 sm:py-5 rounded-full text-base sm:text-xl font-medium shadow-lg hover:bg-[#b34700] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Shop Now
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </NavLink>
                  <NavLink
                    to="/about"
                    className="bg-white/10 backdrop-blur-sm text-white px-6 sm:px-10 py-3 sm:py-5 rounded-full text-base sm:text-xl font-medium shadow-lg border-2 border-white hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    Learn More
                  </NavLink>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="py-8 xs:py-10 sm:py-12 md:py-20 bg-[#fdf8f3]">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 text-center relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-[#d35400]"
          >
            Explore Our Categories
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 group-hover:text-[#d35400] transition-colors duration-300">{cat.name}</h4>
                  <p className="text-gray-600">{cat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <NavLink
              to="/product"
              className="inline-flex items-center gap-2 bg-[#d35400] text-white px-8 py-3 rounded-full text-base font-semibold shadow-lg hover:bg-[#b34700] hover:-translate-y-1 transition-all duration-300"
            >
              Explore More
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </NavLink>
          </motion.div>
        </div>
      </div>

      <div className="py-8 xs:py-10 sm:py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 text-center relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-[#d35400]"
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d35400] transition-colors duration-300">{product.name}</h3>
                  <p className="text-[#d35400] text-xl font-bold">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-8 xs:py-10 sm:py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 text-center relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-[#d35400]"
          >
            Meet Our Artisans
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {artisans.map((artisan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative w-32 h-32 mx-auto mb-5">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-[#d35400] transition-colors duration-300">{artisan.name}</h3>
                <p className="text-gray-600 leading-relaxed">{artisan.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-8 xs:py-10 sm:py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 text-center relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-[#d35400]"
          >
            What Our Customers Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#fdf8f3] rounded-2xl p-8 relative shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <FaQuoteLeft className="text-[#d35400] text-3xl mb-5 transform group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-600 leading-relaxed mb-5">{testimonial.text}</p>
                <p className="text-lg font-semibold group-hover:text-[#d35400] transition-colors duration-300">- {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-12 xs:py-16 sm:py-20 bg-[#d35400] text-white">
        <div className="max-w-2xl mx-auto text-center px-2 xs:px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-5"
          >
            Stay Updated
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg mb-8"
          >
            Subscribe to our newsletter for the latest products and artisan stories
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white"
            />
            <button
              type="submit"
              className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 hover:-translate-y-1"
            >
              Subscribe
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;