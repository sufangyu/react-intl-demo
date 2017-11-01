import React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';

import LocaleProvider from '@/components/locale-provider';
import Home from '@/views/home';

import '@/style/base';

/**
 * 获取国际化资源文件
 *
 * @param {any} lang
 * @returns
 */
function getLocale(lang) {
  /* eslint-disable global-require */
  let result = {};
  switch (lang) {
    case 'zh-CN':
      result = require('./locales/zh-Hans');
      break;
    case 'en-US':
      result = require('./locales/en-US');
      break;
    default:
      result = require('./locales/zh-Hans');
  }

  return result.default || result;
  /* eslint-enable global-require */
}


export default class APP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: 'en-US',
    };
  }

  /**
   * 切换语言
   *
   * @param {any} index 语言序号
   */
  onChange = (index) => {
    const lang = index === 0 ? 'en-US' : 'zh-CN';
    this.setState({
      lang,
    });
  }

  render() {
    const { lang } = this.state;

    const appLocale = getLocale(lang);
    addLocaleData(...appLocale.data);

    return (
      <LocaleProvider locale={appLocale}>
        <IntlProvider
          locale={appLocale.locale}
          messages={appLocale.messages}
          formats={appLocale.formats}
        >
          <Home onChange={(index) => { this.onChange(index); }} />
        </IntlProvider>
      </LocaleProvider>
    );
  }
}
