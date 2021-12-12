import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const checkPasswordPolicy = (pwdPolicy = {}, pwd = '') => {
  const result = {
    valid: true,
    messages: [],
  };

  Object.keys(pwdPolicy).map((field) => {
    switch (field) {
      case 'minLength':
        if (pwd.length < pwdPolicy.minLength) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải ít nhất ${pwdPolicy.minLength} kí tự`,
            en: `Password must be at least ${pwdPolicy.minLength} characters`,
          });
        }
        break;
      case 'maxLength':
        if (pwd.length > pwdPolicy.maxLength) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu chỉ tối đa ${pwdPolicy.maxLength} kí tự`,
            en: `Maxinum password length is ${pwdPolicy.maxLength} characters`,
          });
        }
        break;
      case 'number':
        if (!pwd.match(/\d+/g)) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải chứa ký tự số`,
            en: `Password require at least one number`,
          });
        }
        break;
      case 'upperCase':
        if (!/[A-Z]/.test(pwd)) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải chứa chữ in hoa`,
            en: `Password require at least one uppercase letter`,
          });
        }
        break;
      case 'lowerCase':
        if (!/[a-z]/.test(pwd)) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải chứa chữ in thường`,
            en: `Password require at least one lowercase letter`,
          });
        }
        break;
      case 'specialChars':
        if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pwd)) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải chứa ký tự đặc biệt`,
            en: `Password require at least one symbol character`,
          });
        }
        break;
      case 'blacklist':
        if (pwdPolicy[field].includes(pwd)) {
          result.valid = false;
          result.messages.push({
            vi: `Bạn cần đặt mật khẩu phức tạp hơn`,
            en: `You need to be set more complex password`,
          });
        }
        break;
      default:
        return false;
    }
    return false;
  });

  return result;
};

export const getPicklistsByPageRoutePath = (pageRoutePath: string) => {
  const picklists: any[] = [];
  try {
    let user: any = localStorage.getItem('user');
    if (user) user = JSON.parse(user);
    const routes = user?.routes;
    const module = routes.find((i: any) => i.pages.some((p: any) => p.path === pageRoutePath));
    const page = module.pages.find((p: any) => p.path === pageRoutePath) || {};
    return page.pickLists || [];
  } catch (err) {
    console.log(err)
  }
  return picklists;
};
