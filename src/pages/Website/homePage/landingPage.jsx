import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { motion } from "framer-motion";

import sale1 from "../../../../public/sale1.png";
import sale2 from "../../../../public/sale2.png";
import navSale1 from "../../../../public/sale nav1.jpg";
import navSale2 from "../../../../public/sale nav2.jpg";
import navSale3 from "../../../../public/sale nav3.jpg";
import navSale4 from "../../../../public/sale nav4.jpg";
import navSale5 from "../../../../public/sale nav5.jpg";
import navSale6 from "../../../../public/sale nav6.jpg";
import navSale7 from "../../../../public/sale nav7.jpg";
import navSale8 from "../../../../public/sale nav8.jpg";
import navSale9 from "../../../../public/sale nav9.jpg";
import navSale10 from "../../../../public/sale nav10.jpg";

export default function LandingPage() {
  const images = [
    { original: navSale1, thumbnail: navSale1 },
    { original: navSale2, thumbnail: navSale2 },
    { original: navSale3, thumbnail: navSale3 },
    { original: navSale4, thumbnail: navSale4 },
    { original: navSale5, thumbnail: navSale5 },
    { original: navSale6, thumbnail: navSale6 },
    { original: navSale7, thumbnail: navSale7 },
    { original: navSale8, thumbnail: navSale8 },
    { original: navSale9, thumbnail: navSale9 },
    { original: navSale10, thumbnail: navSale10 },
  ];

  // Animation variants
  const bannerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const sliderVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gradient-to-br from-orange-500 to-pink-300 py-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 px-4">
        <motion.div
          className="w-full lg:w-1/3"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={sale1}
            alt="Sale Banner 1"
            className="w-full rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
        <motion.div
          className="w-full lg:w-1/3"
          variants={sliderVariants}
          initial="hidden"
          animate="visible"
        >
          <ImageGallery
            items={images}
            showThumbnails={true}
            thumbnailPosition="bottom"
            showFullscreenButton={false}
            showPlayButton={false}
            autoPlay={true}
            slideInterval={3000}
            lazyLoad={false}
            additionalClass="rounded-2xl shadow-xl"
          />
        </motion.div>
        <motion.div
          className="w-full lg:w-1/3"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={sale2}
            alt="Sale Banner 2"
            className="w-full rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </div>
    </div>
  );
}