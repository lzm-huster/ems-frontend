import { register } from '@/services/ant-design-pro/api';
import { LoginForm } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Popover,
  Progress,
  Row,
  Select,
  Tabs,
} from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'umi';
import defaultSettings from '../../../config/defaultSettings';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};
const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const Register: FC = () => {
  const [count, setCount]: [number, any] = useState(0);
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [prefix, setPrefix]: [string, any] = useState('86');
  const [popover, setPopover]: [boolean, any] = useState(false);
  const [type, setType] = useState('email');
  const [emailData, setEmailData] = useState('');
  const emailSuffix = '@hust.edu.cn';
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );
  const registerTypeReflect = {
    email: 1,
    mobile: 2,
  };
  const onGetCaptcha = () => {};
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 6) {
      return 'pass';
    }
    return 'poor';
  };
  const onFinish = async (values: API.RegisterParams) => {
    values.registerType = registerTypeReflect[type];
    values.email = values.email + emailSuffix;
    const res = await register(values);
    if (res.code === 20000 && res.data === true) {
      message.success('注册成功');
    } else {
      message.error(res.message);
    }
    // console.log(values);
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/);
    const isMatched = regex.test(value); // inputString为要检查的字符串
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码!');
    }
    if (!isMatched) {
      setVisible(false);
      return promise.reject('密码必须包含数字和字母且长度处于6-20之间');
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };
  const changePrefix = (value: string) => {
    setPrefix(value);
  };
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'email') {
      setEmailData(e.target.value);
    }
  };
  useEffect(() => {
    form.setFieldsValue({ email: emailData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailData]);
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <LoginForm
            logo={<img alt="logo" src={defaultSettings.logo} />}
            title={defaultSettings.title as string}
            subTitle={<h2>华中科技大学管理学院设备管理系统</h2>}
            submitter={{
              render() {
                return (
                  <>
                    <Button
                      size="large"
                      // loading={submitting}
                      className={styles.submit}
                      type="primary"
                      htmlType="submit"
                    >
                      <span>注册</span>
                    </Button>
                    <Link className={styles.login} to="/user/login">
                      <span>已有账号？立即登录！</span>
                    </Link>
                  </>
                );
              },
            }}
            form={form}
            onFinish={onFinish}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane key="email" tab={'邮箱注册'} />
              <Tabs.TabPane key="mobile" tab={'手机号注册'} />
            </Tabs>
            {type === 'email' && (
              <FormItem name="idnumber">
                <Input
                  size="large"
                  placeholder={'请输入学号/工号'}
                  onChange={(e) => onEmailChange(e)}
                />
              </FormItem>
            )}
            {type === 'mobile' && (
              <FormItem name="userName">
                <Input size="large" placeholder={'请输入用户名'} />
              </FormItem>
            )}
            <Popover
              getPopupContainer={(node) => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }
                return node;
              }}
              content={
                visible && (
                  <div
                    style={{
                      padding: '4px 0',
                    }}
                  >
                    {passwordStatusMap[getPasswordStatus()]}
                    {renderPasswordProgress()}
                    <div
                      style={{
                        marginTop: 10,
                      }}
                    >
                      <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                    </div>
                  </div>
                )
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
              visible={visible}
            >
              <FormItem
                name="password"
                className={
                  form.getFieldValue('password') &&
                  form.getFieldValue('password').length > 0 &&
                  styles.password
                }
                rules={[
                  {
                    validator: checkPassword,
                  },
                ]}
              >
                <Input size="large" type="password" placeholder="请输入密码" />
              </FormItem>
            </Popover>
            <FormItem
              name="confirm"
              rules={[
                {
                  required: true,
                  message: '确认密码',
                },
                {
                  validator: checkConfirm,
                },
              ]}
            >
              <Input size="large" type="password" placeholder="确认密码" />
            </FormItem>
            {type === 'email' && (
              <InputGroup compact className={styles.phone}>
                <FormItem
                  initialValue={emailData}
                  style={{
                    width: '100%',
                  }}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: '请输入邮箱!',
                    },
                  ]}
                >
                  <Input
                    size="large"
                    suffix={
                      <>
                        <Divider type="vertical" style={{ height: 20 }} />
                        <span>{emailSuffix}</span>
                      </>
                    }
                    placeholder="请输入邮箱"
                  />
                </FormItem>
              </InputGroup>
            )}
            {type === 'mobile' && (
              <InputGroup compact className={styles.phone}>
                <Select
                  size="large"
                  value={prefix}
                  onChange={changePrefix}
                  style={{
                    width: '22%',
                  }}
                >
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                </Select>
                <FormItem
                  style={{
                    width: '78%',
                  }}
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号!',
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: '手机号格式错误!',
                    },
                  ]}
                >
                  <Input size="large" placeholder="请输入手机号" />
                </FormItem>
              </InputGroup>
            )}

            <Row gutter={8}>
              <Col span={16}>
                <FormItem
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码!',
                    },
                  ]}
                >
                  <Input size="large" placeholder="验证码" />
                </FormItem>
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={!!count}
                  className={styles.getCaptcha}
                  onClick={onGetCaptcha}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </LoginForm>
        </div>
        <Footer />
      </div>
      <div className={styles.main} />
    </>
  );
};
export default Register;
