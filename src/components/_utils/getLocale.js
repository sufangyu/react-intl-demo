/**
 * 获取 组件的语言配置
 *
 * @param {any} props 属性
 * @param {any} context 上下文
 * @param {any} componentName 组件名. 对应 context.locale.messages 中的 key 值
 * @param {any} getDefaultLocale
 */
function getComponentLocale(props, context, componentName, getDefaultLocale) {
  let locale = {};

  // 如果 context 上下文中有多语言配置. 则取 context 上下文中的多语言值.
  // 否则, 取默认值的多语言值.
  if (context && context.locale && context.locale.messages[componentName]) {
    locale = context.locale.messages[componentName];
  } else {
    const defaultLocale = getDefaultLocale();
    locale = defaultLocale.default || defaultLocale;
  }

  let result = {
    ...locale,
  };

  // 如果属性有语言配置项, 则合并.
  if (props.locale) {
    result = {
      ...result,
      ...props.locale,
    };

    if (props.locale.lang) {
      result.lang = {
        ...locale.lang,
        ...props.locale.lang,
      };
    }
  }

  return result;
}


/**
 * 获取 语言的 code 值
 *
 */
function getLocaleCode() {}

export {
  getComponentLocale,
  getLocaleCode,
};
