import React from 'react';
import _ from 'lodash';
import { getLanguageKey } from '@/utils';
// import { languages } from "@/constants";
import { PROVINCE, DISTRICT, WARD } from '@/constants/location';
import { genderList } from '@/constants/common.constant';

const defaultLang = 'vi';

// Text parser (to HTML format)
export const parseDOM = (str: any) => (
  <div className="dangerouslyHTML" dangerouslySetInnerHTML={{ __html: str || '' }} />
);

// print value from field depend on current language
// if current language empty => return default language or null
export const parseValue = (item: any, isBoolean?: boolean) => {
  const currLang = getLanguageKey();
  const val = _.isObject(item) ? item?.[currLang] || item?.[defaultLang] : item;
  return String(isBoolean ? val : val || '');
};

// parse options list for select
// depend on opts list, valueKey & labelKey
// return [{ value: 'value', label: 'label' }]
export const parseOptions = (opts: any, valueKey?: string, labelKey?: string) =>
  opts?.length
    ? opts.map((i: any) => ({
        value: i?.[valueKey || 'value'],
        label: parseValue(i?.[labelKey || 'label']),
      }))
    : [];

// use to parse options list for Select Component
// depend on opts list, valueKey & labelKey
// return [{ value: 'value', label: 'label' }]
// export const parseLanguages = (opts: any) => {
//   const currLang = getLanguageKey();
//   return (
//     opts?.length
//       ? opts.map((o: any) => {
//         const lang = languages.find(l => l.value === o)
//         return lang?.label?.[currLang] || lang?.label?.[defaultLang] || null;
//       })
//       : []
//   )
// }

// covert hex to rgba color
export const hexToRGBA = (hex: string, alpha?: number) => {
  if (!hex) return '';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha || 1})`;
};

// parse address object to string
// use to display html string text
// location = {
//   province: {
//     value: "01",
//     label: "Thành phố Hà Nội",
//     type: "Thành phố Trung ương"
//   },
//   district: {
//     value: "002",
//     label: "Quận Hoàn Kiếm",
//     type: "Quận"
//   },
//   ward: {
//     value: "00049",
//     label: "Phường Hàng Đào",
//     type: "Phường"
//   },
//   detail: "01 Lê Lai"
// }
// return "01 Lê Lai, Phường Hàng Đào, Quận Hoàn Kiếm, Thành phố Hà Nội"
export const parseAddressObjToStr = (addObj: any) => {
  const province = addObj?.province?.label || '';
  const district = addObj?.district?.label || '';
  const ward = addObj?.ward?.label || '';
  const detail = addObj?.detail || '';
  if (!detail && !ward && !district && !province) {
    return '';
  }
  return `${detail}, ${ward}, ${district}, ${province}`;
};

// parse address array to object location
// use to saving location from Cascade Component (onChange)
// onChange: (value, selectedOptions) => void
// selectedOptions = [province, district, ward]
// return {
//   province: {
//     value: "01",
//     label: "Thành phố Hà Nội",
//     type: "Thành phố Trung ương"
//   },
//   district: {
//     value: "002",
//     label: "Quận Hoàn Kiếm",
//     type: "Quận"
//   },
//   ward: {
//     value: "00049",
//     label: "Phường Hàng Đào",
//     type: "Phường"
//   }
// }
export const parseAddressArrToObj = (addArr: any[]) => {
  if (_.isArray(addArr) && addArr?.length) {
    return {
      province: {
        value: addArr?.[0]?.value || '',
        label: addArr?.[0]?.label || '',
        type: addArr?.[0]?.type || '',
      },
      district: {
        value: addArr?.[1]?.value || '',
        label: addArr?.[1]?.label || '',
        type: addArr?.[1]?.type || '',
      },
      ward: {
        value: addArr?.[2]?.value || '',
        label: addArr?.[2]?.label || '',
        type: addArr?.[2]?.type || '',
      },
    };
  }
  return {
    province: '',
    district: '',
    ward: '',
  };
};

export const parseLocationKeyToStringv2 = (address: any) => {
  {
    const province = PROVINCE.find((item) => item.id === address?.residence[0]) || {
      label: '',
      children: [],
    };
    const district = DISTRICT.find((item: any) => item.id === address?.residence[1]) || {
      label: '',
      children: [],
    };
    const ward = WARD.find((item: any) => item.id === address?.residence[2]) || {
      label: '',
      WARD,
    };
    return `${address.detail ? address.detail + ',' : ''} ${ward?.name || ''}, ${
      district?.name || ''
    }, ${province?.name || ''}`;
  }
};

// parse address object location to array
// use to initValue for Cascade Component
// location = {
//   province: {
//     value: "01",
//     label: "Thành phố Hà Nội",
//     type: "Thành phố Trung ương"
//   },
//   district: {
//     value: "002",
//     label: "Quận Hoàn Kiếm",
//     type: "Quận"
//   },
//   ward: {
//     value: "00049",
//     label: "Phường Hàng Đào",
//     type: "Phường"
//   }
// }
// return ['01', '002', '00049']

export const parseAddressObjToArr = (addObj: any) => {
  const province = addObj?.province?.value || '';
  const district = addObj?.district?.value || '';
  const ward = addObj?.ward?.value || '';
  if (!ward && !district && !province) {
    return [];
  }
  return [province, district, ward];
};

// parse gender
export const parseGender = (val: string) => {
  if (!val) return '';
  const item = genderList.find((i) => i.value === val);
  return parseValue(item?.label || '');
};
