import { ResPage, Device } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 设备管理模块
 */
// * 获取设备列表
export const getDeviceList = (params: Device.ReqDeviceParams) => {
  return http.post<ResPage<Device.ResDeviceList>>(PORT1 + `/devices/list`, params);
};

// * 新增设备
export const addDevice = (params: any) => {
  return http.post(PORT1 + `/devices/add`, params);
};

// * 编辑设备
// export const editDevice = (params: { id: string }) => {
export const editDevice = (params: any) => {
  return http.post(PORT1 + `/devices/edit`, params);
};

// * 删除设备
// export const deleteDevice = (params: { id: string[] }) => {
export const deleteDevice = (id: number) => {
  return http.get(PORT1 + `/devices/delete/${id}`);
};

export const uploadOtaFile = (params: any) => {
  return http.post(PORT1 + `/devices/uploadfile`, params);
};

export const getOtaFileList = (did: number) => {
  return http.get<any>(PORT1 + `/devices/otafiles/${did}`);
};

export const deleteOtaFile = (id: number) => {
  return http.get(PORT1 + `/devices/delfile/${id}`);
};

export const signOtaFile = (did: number, fid: number) => {
  return http.get(PORT1 + `/devices/sign/${did}/${fid}`);
};

export const downloadOtaFile = (fid: number) => {
  return http.download(PORT1 + `/devices/downloadfile/${fid}`);
};
