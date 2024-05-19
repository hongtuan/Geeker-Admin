import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 1.1
export const getLogContent = () => {
  return http.get<any>(PORT1 + `/loadlog`);
};
// 1.2
export const clearLogFile = () => {
  return http.get<any>(PORT1 + `/clearlogfile`);
};
// 1.3
export const downloadLog = () => {
  return http.get<any>(PORT1 + `/downloadlog`);
};
// 1.4
export const downloadLogGz = () => {
  // 下载二进制格式文件，需要调用download方法，
  // TODO:  从后台提取文件名，需要进一步研究。
  return http.download(PORT1 + `/downloadloggz`);
  // return http.download_with_filename(PORT1 + `/downloadloggz`);
};
// 2.1
export const getSysTime = () => {
  return http.get<any>(PORT1 + `/getsystime`);
};
// 2.2
export const setSysTime = (params: any) => {
  return http.post<any>(PORT1 + `/setsystime`, params);
};
// 3.1
export const getEthMac = () => {
  return http.get<any>(PORT1 + `/getethmac`);
};
// 3.2
export const setEthMac = (params: any) => {
  return http.post<any>(PORT1 + `/setethmac`, params);
};
// 3.3
export const getEthConf = () => {
  return http.get<any>(PORT1 + `/getethconf`);
};
// 3.4
export const setEthConf = (params: any) => {
  return http.post<any>(PORT1 + `/setethconf`, params);
};
// 3.5
export const loadEthConfDefault = () => {
  return http.get<any>(PORT1 + `/loadethconfdefault`);
};
// 3.6
export const getTJTestMode = () => {
  return http.get<any>(PORT1 + `/gettjtestmode`);
};
// 3.7
export const setTJTestMode = (params: any) => {
  return http.post<any>(PORT1 + `/settjtestmode`, params);
};
// 3.8
export const restartGwSrv = () => {
  return http.get<any>(PORT1 + `/restartgwsrv`);
};
// 3.9
export const rebootDev = () => {
  return http.get<any>(PORT1 + `/rebootdev`);
};

// 4.1
export const getINSConf = () => {
  return http.get<any>(PORT1 + `/getinsconf`);
};
// 4.2
export const setINSConf = (params: any) => {
  return http.post<any>(PORT1 + `/setinsconf`, params);
};
// 4.3
export const loadINSConfDefault = () => {
  return http.get<any>(PORT1 + `/loadinsconfdefault`);
};

// 5.1
export const getCPT7Conf = () => {
  return http.get<any>(PORT1 + `/getcpt7conf`);
};
// 5.2
export const setCPT7Conf = (params: any) => {
  return http.post<any>(PORT1 + `/setcpt7conf`, params);
};
// 5.3
export const loadCPT7ConfDefault = () => {
  return http.get<any>(PORT1 + `/loadcpt7confdefault`);
};

// 6.1
export const getAppVerInfo = () => {
  return http.get<any>(PORT1 + `/getappverinfo`);
};
// 6.2
export const uploadAppFile = (params: any) => {
  return http.post<any>(PORT1 + `/uploadappfile`, params);
};
// 6.3
export const getAdminVerInfo = () => {
  return http.get<any>(PORT1 + `/getadminverinfo`);
};
// 6.4
export const uploadAdminFile = (params: any) => {
  return http.post<any>(PORT1 + `/uploadadminfile`, params);
};
