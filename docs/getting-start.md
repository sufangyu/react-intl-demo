## React Intl 国际化步骤

1. 创建国际化资源文件
2. 根据语言获取国际化资源
3. 引入 react-intl 的 local data
4. 创建 LocaleProvider 国际化上下文组件
5. 创建 react-intl 国际化上下文组件
6. 使用 react-intl's components & apis，进行国际化开发

### 1. 创建国际化资源文件

目前我们管理资源文件的方式是在 src/locales 文件夹下：

```
.
├── en-US.js
├── en-US.messages.js
├── zh-Hans.js
└── zh-Hans.messages.js
```

\*.messages.js 是我们的资源文件(这里我们采用了 js 格式，你也可以使用 json 等等)，返回的是一个对象，key 为我们翻译用的 id，value 为具体语言的翻译，内容是：

```javascript
export default {
  'page.localeProvider.react': '{ name }, a JavaScript library for building user interfaces.',
  'page.localeProvider.react.html': '<p>{ name } makes it painless to create interactive UIs. Design simple views for each state in your application, and { name } will efficiently update and render just the right components when your data changes.</p><p>Declarative views make your code more predictable and easier to debug.</p>',
  'page.localeProvider.unreadCount': 'You have {unreadCount} new {notifications}',
  'page.localeProvider.title.date': 'Current date: ',
  'page.localeProvider.title.time': 'Current time: ',
  'page.localeProvider.title.relative': 'Relative current time: ',
  'page.localeProvider.title.number': 'Comma number: ',
  'page.localeProvider.title.price': 'Price: ',
  'page.localeProvider.title.percent': 'Percent: ',
};
```

en-US.js 文件封装了 messages、locale 等国际化上下文组件需要的内容：

```javascript
import appLocaleData from 'react-intl/locale-data/en';
// 引入组件多语言
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
```


有了这些资源文件以及相关的封装之后，我们就可以在 `LocaleProvider` 和 `InltProvider` 中使用了。


### 2. 根据语言加载国际化资源

上一步我们创建了不同语言版本的国际化资源文件，我们还需要一个函数能够根据语言，加载对应的资源文件：

```javascript
/**
 * 获取国际化资源文件
 *
 * @param {any} lang
 * @returns
 */
function getLocale(lang) {
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
}
```


### 3. 引入 react-intl 的 local data

```javascript
import { addLocaleData } from 'react-intl';
...

render() {
  const appLocale = getLocale('en-US');
  addLocaleData(...appLocale.data);
  ...
}
```

react-intl 在做国际化的时候需要一些特有的 local data，主要是进行相对时间翻译时，比如昨天、今天、明天、几分钟前、几个月前之类的。
我们通过 `addLocaleData` 这个方法加载相关内容，大家可以根据实际情况加载需要的 locale-data。


### 4. 创建 LocaleProvider 国际化上下文组件

为了组件能够国际化资源信息，我们需要一个 LocaleProvider 组件，用它来提供国际化的上下文，具体用法：

```javascript
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
```

### 5. 创建 react-intl 国际化上下文组件

为了能够使用 react-intl 进行国际化，跟 redux 这些框架一样，我们需要一个 Provider Component，用它来提供国际化的上下文，具体用法：

```javascript
...
import { addLocaleData, IntlProvider } from 'react-intl';
import LocaleProvider from '@/components/locale-provider';
import Home from '@/views/home';
...

render() {
  // 根据语言获取国际化资源
  const appLocale = getLocale('en-US');
  addLocaleData(...appLocale.data);

  return (
    <LocaleProvider locale={appLocale}>
      <IntlProvider
        locale={appLocale.locale}
        messages={appLocale.messages}
        formats={appLocale.formats}
      >
        <Home />
      </IntlProvider>
    </LocaleProvider>
  );
}
```

```js
LocaleProvider 有三个配置参数：
  locale, <object>, 国际化资源.

IntlProvider 有三个配置参数：
  locale, <string>, 语言标记，例如 'zh-CN' 'en-US'
  messages, <object>, 国际化所需的 key-value 对象
  formats, <object>, 自定义 format，比如日期格式、货币等
```


在定义好 `IntlProvider` 之后，我们就可以在页面使用它提供的 api 或者组件来进行国际化了。

### 6. 使用 react-intl's components & apis

react-intl 提供了丰富的组件和 api 来完成页面部分的国际化。


#### 字符串的格式化
a. `<FormattedMessage />` 这个组件用于格式化字符串，是所有的组件中使用频率最高的组件。除了可以根据配置输出不同语言的简单字符串之外，还可以输出包含动态变化的参数的复杂字符串，具体的用法在后面的例子中会慢慢叙述。

比如我们在 *.message.js 配置文件中写了如下内容：
```javascript
export default {
  'page.localeProvider.react': '{ name }, a JavaScript library for building user interfaces.',
};
```

使用这个组件的时候，我们这么写：
```javascript
<FormattedMessage
  tagName="p"
  id="page.localeProvider.react"
  values={{
    name: 'React',
  }}
  defaultMessage="{name} 是一个用于构建用户界面的 JAVASCRIPT 库。"
  description="{name} 是什么？"
/>
```
* id 指代的是这个字符串在配置文件中的属性名
* description 指的是对于这个位置替代的字符串的描述，便于维护代码，不写的话也不会影响输出的结果
* defaultMessage 当在locale配置文件中没有找到这个id的时候，输出的默认值
* tagName 实际生成的标签，默认是 `span`
* values 动态参数. 格式为对象

输出的结果：
```html
<p>React, a JavaScript library for building user interfaces.</p>
```

b. `<FormattedHTMLMessage />` 这个组件的用法和<FormattedMessage />完全相同，唯一的不同就是输出的字符串可以包含HTML标签。


#### 日期时间

a. `<FormattedDate />` 用于格式化日期，能够将一个时间戳格式化成不同语言中的日期格式。

传入时间戳作为参数：
```javascript
<FormattedDate 
  value={new Date(1459832991883)}
/>
```

输出结果：
```html
<!-- 英文 -->
<span>4/5/2016</span>

<!-- 中文 -->
<span>2016/5/4</span>
```

b. `<FormattedTime>` 用于格式化时间，效果与`<FormattedDate />`相似。

传入时间戳作为参数：
```javascript
<FormattedTime 
  value={new Date(1459832991883)}
/>
```

输出结果：
```html
<!-- 英文 -->
<span>1:09 AM</span>

<!-- 中文 -->
<span>上午1:09</span>
```

c. `<FormattedRelative />` 通过这个组件可以显示传入组件的某个时间戳和当前时间的关系，比如“10 minutes ago”。

传入时间戳作为参数：
```js
<FormattedRelative 
  value={Date.now()}
/>
```

输出结果:
```html
<!-- 英文 =>> 运行时的输出结果： -->
<span>now</span>

<!-- 英文 =>> 10秒之后的输出结果： -->
<span>10 seconds ago</span>

<!-- 英文 =>> 1分钟之后的输出结果： -->
<span>1 minute ago</span>

<!-- 中文 =>> 运行时的输出结果： -->
<span>现在</span>

<!-- 中文 =>> 10秒之后的输出结果： -->
<span>10秒前</span>

<!-- 中文 =>> 1分钟之后的输出结果： -->
<span>1分钟前</span>
```

#### 数字量词

a. `<FormattedPlural />` 这个组件可用于格式化量词，在中文的语境中，其实不太会用得到，比如我们说一个鸡腿，那么量词就是‘个’，我们说两个鸡腿，量词还是‘个’，不会发生变化。但是在英文的语言环境中，描述一个苹果的时候，量词是apple，当苹果数量为两个时，就会变成apples，这个组件的作用就在于此。

传入组件的参数中，value为数量，其他的为不同数量时对应的量词，在下面的例子中，一个的时候量词为message，两个的时候量词为messages。实际上可以传入组件的量词包括 zero, one, two, few, many, other 已经涵盖了所有的情况。

结合 `<FormattedMessage />`运用：
```js
const unreadCount = 10;
const unreadCount2 = 1;
... 

<p>
  <FormattedMessage
    id="page.localeProvider.unreadCount"
    defaultMessage={'你有{ unreadCount }条新信息'}
    values={{
      unreadCount: (
        <strong
          style={{
            color: '#f30',
            fontWeight: 'normal',
          }}
        >
          <FormattedNumber
            value={unreadCount}
          />
        </strong>
      ),
      notifications: (
        <FormattedPlural
          value={unreadCount}
          one="notification"
          other="notifications"
        />
      ),
    }}
  />
</p>
<p>
  <FormattedMessage
    id="page.localeProvider.unreadCount"
    defaultMessage={'你有{ unreadCount2 }条新信息'}
    values={{
      unreadCount: (
        <strong
          style={{
            color: '#f30',
            fontWeight: 'normal',
          }}
        >
          <FormattedNumber
            value={unreadCount2}
          />
        </strong>
      ),
      notifications: (
        <FormattedPlural
          value={unreadCount2}
          one="notification"
          other="notifications"
        />
      ),
    }}
  />
</p>
```

输出结果：
```html
<!-- 英文 -->
<p>You have 10 new notifications</p>
<p>You have 1 notification</p>

<!-- 中文 -->
<p>你有10条新信息</p>
<p>你有1条新信息</p>
```


b. `<FormattedNumber />` 这个组件最主要的用途是用来给一串数字标逗号，比如10000这个数字，在中文的语言环境中应该是1,0000，是每隔4位加一个逗号，而在英语的环境中是10,000，每隔3位加一个逗号。

传入数字作为参数：
```js
<FormattedNumber 
  value={1000}
/>
```

输出结果：
```html
<span>1,000</span>
```

`<FormattedNumber />` 输出百分比

传入小数作为参数：
```js
<FormattedNumber
  value={0.5}
  style="percent"
/>
```

输出结果：
```html
<span>50%</span>
```

`<FormattedNumber />` 输出货币

传入数字作为参数：
```js
// locale.formats.money.currency 是 /locales/*.js 国际化资源配置的货币信息。中文: 'CNY'; 英文: 'USD'

<FormattedNumber
  value={123456.78}
  style="currency"
  currency={locale.formats.money.currency}
/>
```

输出结果：
```html
<!-- 英文 -->
<span>$123,456.78</span>

<!-- 中文 -->
<span>￥123,456.78</span>
```



注：项目在中文情况下也是每隔3位加一个逗号，具体原因详，如果有知道原因的请告知。


## 组件国际化

### 1. 创建获取上下文国际化资源函数
```js
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
```

### 2. 创建国际化的组件
```js
...
import { getComponentLocale } from '../_utils/getLocale';
...

export default class Pagination extends React.Component {
  // context 上下文
  static contextTypes = {
    locale: PropTypes.object,
  };

  render() {
    const currentlocale = getComponentLocale(this.props, this.context, 'Pagination', () => {
      require('./locales/zh-CN');
    });

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
```


## 国际化规范附录

### React Intl 编写规范
1. 必须填写 defaultMessage，并将 defaultMessage 作为中文翻译
2. id 不得重复
3. 在使用 intl.formatMessage() 时，必须使用 defineMessages，预定义消息



## 资料

* [API](https://segmentfault.com/a/1190000005824920)
* [国际化方案](https://github.com/ant-design/intl-example/blob/master/docs/understanding-antd-i18n.md )
* [Intl.NumberFormat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)