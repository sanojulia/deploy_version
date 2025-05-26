import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './ProductThumbnail.module.css'

const ProductThumbnail = ({product}) => {
    const { name, isNew, image = {} } = product;

    const defaultImages = ['/images/products/placeholder.jpg'];
    const images = [image.main, image.hover].filter(Boolean) || defaultImages;
    

  return (
        <div 
          className={styles.card}
        >
          <div className={styles.imageContainer}>
            <Swiper
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                loop={true}
                navigation={true}
                modules={[Navigation, Pagination]}
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img src={img} alt={name} className={styles.image} />
                    </SwiperSlide>
                 ))}    
            </Swiper>
            {isNew && <span className={styles.newBadge}>NEW</span>}     
          </div>
        </div>
  )
};

export default ProductThumbnail;