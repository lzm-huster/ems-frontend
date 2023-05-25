import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '设备管理系统',
  pwa: false,
  logo: 'http://101.43.18.103:9001/mes-bucket/logo/%E8%AE%BE%E5%A4%87%E7%AE%A1%E7%90%86.png',
  iconfontUrl: '',
};

export default Settings;
