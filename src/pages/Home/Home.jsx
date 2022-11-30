import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Home.module.scss';

const propTypes={
  className: PropTypes.string,
  id: PropTypes.string,
};

const defaultProps={
  className: '',
  id: undefined,
};

const Home=({ className, id, texts: textsProp }) => {

  const homeClassNames=classnames(styles.Home, className);



  return (
    <div
      className={ homeClassNames }
      id={ id }
    >
      ComponentText
    </div>
  );
};

Home.propTypes=propTypes;
Home.defaultProps=defaultProps;

export default Home;
