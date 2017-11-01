import appLocaleData from 'react-intl/locale-data/en';
// 引入组件的多语言
import paginationLocale from '@/components/pagination/locales/en-US';
import messages from './en-US.messages';

window.appLocale = {
  // 合并所有 messages, 加入组件的 messages
  messages: Object.assign({}, messages, {
    Pagination: paginationLocale,
  }),

  // locale
  locale: 'en-US',

  // react-intl locale-data
  data: appLocaleData,

  // 自定义 formates
  formats: {
    date: {
      normal: {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      },
    },
    // 货币
    money: {
      currency: 'USD',
    },
  },
};

export default window.appLocale;
