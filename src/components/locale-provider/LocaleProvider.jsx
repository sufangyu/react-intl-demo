import React from 'react';
import PropTypes from 'prop-types';

export default class LocaleProvider extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    locale: PropTypes.object,
  };

  static childContextTypes = {
    // 语言信息
    locale: PropTypes.object,
  };

  getChildContext() {
    return {
      locale: {
        ...this.props.locale,
      },
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
