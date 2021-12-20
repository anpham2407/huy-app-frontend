// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { Request, Response } from 'express';
import { HttpService } from '@/utils/http.service';

/** GET /api/getOrders */
export async function getOrders(options?: { [key: string]: any }) {
  const resp = await HttpService.get('/order', options);
  return resp;
}

// /** 退出登录接口 POST /api/login/outLogin */
export async function createOrder(options?: { [key: string]: any }) {
  const resp = await HttpService.post('/order', options);
  return resp;
}

export async function updateOrder(options?: { [key: string]: any }) {
  const resp = await HttpService.patch(`/order/${options?.id}`, options);
  return resp;
}

export async function removeOrder(options?: { [key: string]: any }) {
  const resp = await HttpService.delete(`/order/${options?.id}`);
  return resp;
}

// /** 登录接口 POST /api/login/account */
// export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
//   return request<API.LoginResult>('/api/login/account', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: body,
//     ...(options || {}),
//   });
// }

// /** 此处后端没有提供注释 GET /api/notices */
// export async function getNotices(options?: { [key: string]: any }) {
//   return request<API.NoticeIconList>('/api/notices', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

// /** 获取规则列表 GET /api/rule */
// export async function rule(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/api/rule', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

// /** 新建规则 PUT /api/rule */
// export async function updateRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'PUT',
//     ...(options || {}),
//   });
// }

// /** 新建规则 POST /api/rule */
// export async function addRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }

// /** 删除规则 DELETE /api/rule */
// export async function removeRule(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/rule', {
//     method: 'DELETE',
//     ...(options || {}),
//   });
// }
