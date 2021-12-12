export { message } from 'antd';
import { getToken } from '@/utils/storage';

// LOCALHOST
const BASE_API = 'http://localhost:3000/v1';

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

const buildParams = (params: any) => {
  return Object.keys(params).length
    ? `?${Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join('&')}`
    : '';
};

// eslint-disable-next-line consistent-return
const handleError = (response: any) => {
  if (response?.status === 401) {
    window.location.href = '/user/login';
    return false;
  }
  if (response?.status === 403) {
    message.error('Lỗi 403').then();
    return false;
  }
  return response?.data;
};

interface ParamProps {
  current?: number | string | undefined;
  pageIndex?: number | string | undefined;
  keyword?: string | undefined;
  dateFr?: string | undefined;
  dateTo?: string | undefined;
  sortBy?: string | undefined;
  sortType?: number | string | undefined;
}

export const HttpService = {
  get: async (path: string, queryParams: ParamProps | any = {}, options?: any) => {
    try {
      const params = { ...queryParams };
      if (params.current) {
        params.pageIndex = params.current;
        delete params.current;
      }

      if (!params?.keyword) {
        delete params.keyword;
      }

      if (!params?.dateFr) {
        delete params.dateFr;
      }

      if (!params?.dateTo) {
        delete params.dateTo;
      }

      if (options && Object.keys(options).length > 0) {
        const sortBy = Object.keys(options)[0];
        params.sortBy = sortBy;
        params.sortType = { ascend: 1, descend: -1 }[options[sortBy]];
      }
      console.log('getHeaders', getHeaders());
      const response = await fetch(`${BASE_API}${path}${buildParams(params)}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  post: async (path: string, data: any) => {
    try {
      const response = await fetch(`${BASE_API}${path}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  put: async (path: string, data: any) => {
    try {
      const response = await fetch(`${BASE_API}${path}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  delete: async (path: string, data: any) => {
    try {
      const response = await fetch(`${BASE_API}${path}`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  getFile: async (path: string) => {
    const fileHeaders = {
      Authorization: `Bearer ${getToken()}`,
    };
    try {
      const response = await fetch(`${FILE_API}${path}`, {
        method: 'GET',
        headers: fileHeaders,
      });
      if (response.status !== 200) {
        handleError(response);
      }
      const fileName = path.split('/').pop();
      if (fileName) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },
  fileUpload: async (path: string, files: any) => {
    const fileHeaders = {
      Authorization: `Bearer ${getToken()}`,
    };
    const form = new FormData();
    if (files.length > 0) {
      files.forEach((file: any) => {
        form.append('file', file);
      });
    } else form.append('file', files);
    const options = {
      method: 'POST',
      body: form,
      headers: fileHeaders,
    };
    try {
      const response = await fetch(`${FILE_API}${path}`, options);
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
};
