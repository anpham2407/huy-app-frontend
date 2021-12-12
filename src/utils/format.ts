import _ from 'lodash';

const moment = require('moment');

export const formatCode = (code: string) => {
  return String(code?.replace(/\s/g, ''));
};

export const formatAddress = (address: any) => {
  if (!address) return null;
  const { addressDetail, district, province, ward } = address;
  return `${addressDetail ? addressDetail + ', ' : ''} ${district ? district + ', ' : ''} ${
    ward ? ward + ', ' : ''
  } ${province ? province : ''}`;
};

const isValid = (str: any) =>
  str !== '' && !_.isNull(str) && !_.isEmpty(str) && !_.isUndefined(str);

const DEFAULT_DATE_FORMAT = {
  vi: 'DD/MM/YYYY',
  en: 'MM/DD/YYY',
};
const DEFAULT_DATETIME_FORMAT = {
  vi: 'DD/MM/YYYY HH:mm',
  en: 'MM/DD/YYYY HH:mm',
};
const DEFAULT_DATETIMES_FORMAT = {
  vi: 'DD/MM/YYYY HH:mm:ss',
  en: 'MM/DD/YYYY HH:mm:ss',
};

export const data = (values: any) => {
  if (!isValid(values)) {
    return false;
  }
  return values?.data || [];
};

export const date = (str: any, fm?: string) => {
  if (!isValid(str)) {
    return '';
  }
  const format = fm || DEFAULT_DATE_FORMAT.vi;
  const d = moment(str);
  // check if str is datetime string
  if (d.isValid()) {
    return d.format(format);
  }
  const dd = moment(str, 'x');
  // check if str is miliseconds
  if (dd.isValid()) {
    return dd.format(format);
  }
  return 'Invalid date';
};

export const datetime = (str: any, fm?: string) => date(str, fm || DEFAULT_DATETIME_FORMAT.vi);

export const datetimes = (str: any, fm?: string) => date(str, fm || DEFAULT_DATETIMES_FORMAT.vi);

export const toDateString = (str: any) =>
  isValid(str) ? moment(str).toISOString().substr(0, 10) : false;

export const toISOString = (str: any) => (isValid(str) ? moment(str).toISOString() : false);

export const currency = (number: any) => {
  if (number !== 0 && !_.isNull(number) && !_.isEmpty(number) && !_.isUndefined(number)) {
    return false;
  }
  const num = parseFloat(number); // convert string to number
  const arr = num.toFixed(2).split('.');
  const chars = arr[0].split('').reverse();
  let str = '';
  let count = 0;
  for (const x in chars) {
    count += 1;
    if (count !== 1 && count % 3 === 1) {
      str = `${chars[x]}.${str}`;
    } else str = chars[x] + str;
  }
  return str;
};

export const phone = (str: any) => {
  if (!isValid(str)) {
    return false;
  }
  const cleaned = `${str}`.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  const match = cleaned.match(/^(\d{0,})(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    const intl1 = match[1] ? `(+${match[1]}) ` : '';
    return [intl1, '', match[2], ' ', match[3], ' ', match[4]].join('');
  }
  return cleaned;
};
