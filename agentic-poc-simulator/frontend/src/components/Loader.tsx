import React from 'react';
import styles from './Loader.module.css';

const Loader: React.FC = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.spinner}></div>
    <span>Loading...</span>
  </div>
);

export default Loader; 