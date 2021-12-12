import { PROVINCE, DISTRICT, WARD } from '@/constants/location';

// get province by id
// get all province if id null
export const getProvince = (id: string) => {
  if (!id) return PROVINCE;
  if (id) return PROVINCE.filter((item : any) => item.id === id)
}

// get district by id
// get all district if id null
export const getDistrict = (id: string) => {
  if (!id) return [];
  if (id) return DISTRICT.filter((item : any) => item.province === id)
}

// get ward by provinceId and districtId
// get all provinceId and districtId is null
export const getWard = ({ provinceId, districtId }) => {
  let ward = WARD;
  if (provinceId) {
    ward = WARD.filter((item : any) => item.province === provinceId)
  }
  if (districtId) {
    ward = WARD.filter((item : any) => item.district === districtId)
  }
  return ward;
}
