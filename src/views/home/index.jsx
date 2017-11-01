import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedHTMLMessage,
  FormattedDate,
  FormattedTime,
  FormattedRelative,
  FormattedNumber,
  FormattedPlural,
} from 'react-intl';

import Pagination from '@/components/pagination';

import './scss/home';

export default class Home extends React.Component {
  static propTypes = {
    langSelectedIndex: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    langSelectedIndex: 0,
  }

  // 获取 context
  static contextTypes = {
    locale: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const langSelectedIndex = props.langSelectedIndex;
    this.state = {
      langSelectedIndex, // 当前选中的语言序号

      unreadCount: 10,
      unreadCount2: 1,
    };
  }

  onChange(index) {
    if (this.state.langSelectedIndex === index) {
      return;
    }

    if (this.props.onChange) {
      this.props.onChange(index);
    }

    this.setState({
      langSelectedIndex: index,
    });
  }

  render() {
    const { langSelectedIndex, unreadCount, unreadCount2 } = this.state;
    const { locale } = this.context;

    return (
      <div className="page page__home">
        <div className="page__body">

          <div className="segment">
            <div
              className={langSelectedIndex === 0 ? 'segment__item segment__item--selected' : 'segment__item'}
              role="tab"
              tabIndex="-1"
              onClick={() => {
                this.onChange(0);
              }}
            >English</div>
            <div
              className={langSelectedIndex === 1 ? 'segment__item segment__item--selected' : 'segment__item'}
              role="tab"
              tabIndex="-1"
              onClick={() => {
                this.onChange(1);
              }}
            >中文</div>
          </div>

          <div className="demo__preview">
            <div className="demo__preview__title">组件</div>
            <div className="demo__preview__content demo__preview__content--bg">
              <Pagination />
            </div>
          </div>

          <div className="demo__preview">
            <div className="demo__preview__title">字符串</div>
            <div className="demo__preview__content demo__preview__content--bg">
              <div className="text__content">
                <FormattedMessage
                  tagName="p"
                  id="page.localeProvider.react"
                  values={{
                    name: 'React',
                  }}
                  defaultMessage="{name} 是一个用于构建用户界面的 JAVASCRIPT 库。"
                  description="{name} 是什么？"
                />
                <FormattedMessage
                  tagName="div"
                  id="page.localeProvider.react.html"
                  values={{
                    name: 'React',
                  }}
                  defaultMessage="<p>{ name }用于无痛创建交互式 UI。为您的应用程序中的每个状态设计简单的视图，并且当你的数据更改时，React将有效地更新和渲染正确的组件。</p><p>声明式视图使您的代码更可预测，更易于调试。</p>"
                  description="{name} 声明式"
                />
              </div>
            </div>
          </div>

          <div className="demo__preview">
            <div className="demo__preview__title">字符串 - HTML标签</div>
            <div className="demo__preview__content demo__preview__content--bg">
              <div className="text__content">
                <FormattedHTMLMessage
                  tagName="p"
                  id="page.localeProvider.react"
                  values={{
                    name: 'React',
                  }}
                  defaultMessage="{name} 是一个用于构建用户界面的 JAVASCRIPT 库。"
                  description="{name} 是什么？"
                />
                <FormattedHTMLMessage
                  tagName="div"
                  id="page.localeProvider.react.html"
                  values={{
                    name: 'React',
                  }}
                  defaultMessage="<p>{ name }用于无痛创建交互式 UI。为您的应用程序中的每个状态设计简单的视图，并且当你的数据更改时，React将有效地更新和渲染正确的组件。</p><p>声明式视图使您的代码更可预测，更易于调试。</p>"
                  description="{name} 声明式"
                />
              </div>
            </div>
          </div>

          <div className="demo__preview">
            <div className="demo__preview__title">日期时间</div>
            <div className="demo__preview__content demo__preview__content--bg">
              <div className="text__content">
                <p>
                  <FormattedMessage
                    id="page.localeProvider.title.date"
                    defaultMessage="当前日期："
                  />
                  <FormattedDate
                    value={Date.now()}
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="page.localeProvider.title.time"
                    defaultMessage="当前时间："
                  />
                  <FormattedTime
                    value={Date.now()}
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="page.localeProvider.title.relative"
                    defaultMessage="相对当前时间："
                  />
                  <FormattedRelative
                    value={Date.now()}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="demo__preview">
            <div className="demo__preview__title">数字量词</div>
            <div className="demo__preview__content demo__preview__content--bg">
              <div className="text__content">
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
              </div>
            </div>
          </div>

          <div className="demo__preview">
            <div className="demo__preview__title">货币、百分比</div>
            <div className="demo__preview__content demo__preview__content--bg">
              <div className="text__content">
                {/* eslint-disable react/style-prop-object */}
                <p>
                  <FormattedMessage
                    id="page.localeProvider.title.number"
                    defaultMessage="数字格式化："
                  />
                  <FormattedNumber
                    value={10000}
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="page.localeProvider.title.price"
                    defaultMessage="价格："
                  />
                  <FormattedNumber
                    value={123456.78}
                    style="currency"
                    currency={locale.formats.money.currency}
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="page.localeProvider.title.percent"
                    defaultMessage="百分比："
                  />
                  <FormattedNumber
                    value={0.5}
                    style="percent"
                  />
                </p>
                {/* eslint-enable react/style-prop-object */}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
