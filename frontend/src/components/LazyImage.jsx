import React from 'react';
import PropTypes from 'prop-types';

const LazyImage = ({ src, alt }) => {
     return <img src={src} alt={alt} loading="lazy" />;
};

LazyImage.propTypes = {
     src: PropTypes.string.isRequired,
     alt: PropTypes.string.isRequired,
};

export default LazyImage;