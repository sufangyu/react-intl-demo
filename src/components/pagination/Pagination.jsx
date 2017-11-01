import React from 'react';
import PropTypes from 'prop-types';
import { getComponentLocale } from '../_utils/getLocale';

import './scss';

export default class Pagination extends React.Component {
  static propTypes = {}

  // context 上下文
  static contextTypes = {
    locale: PropTypes.object,
  };

  render() {
    /* eslint-disable global-require */
    const currentlocale = getComponentLocale(this.props, this.context, 'Pagination', () => {
      require('./locales/zh-CN');
    });
    /* eslint-enable global-require */

    return (
      <div className="pagination">
        <div className="pagination__wrapper">
          <div className="pagination__button__prev">
            <a>{currentlocale.prevText}</a>
          </div>
          <div className="pagination__button__next">
            <a>{currentlocale.nextText}</a>
          </div>
        </div>
      </div>
    );
  }
}
