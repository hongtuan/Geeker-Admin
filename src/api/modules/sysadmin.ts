import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
// 1
export const getLogContent = () => {
  return http.get<any>(PORT1 + `/loadlog`);
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

// 4.1
export const getINSConf = () => {
  return http.get<any>(PORT1 + `/getinsconf`);
};
// 4.2
export const setINSConf = (params: any) => {
  return http.post<any>(PORT1 + `/setinsconf`, params);
};

// 5.1
export const getCPT7Conf = () => {
  return http.get<any>(PORT1 + `/getcpt7conf`);
};
// 5.2
export const setCPT7Conf = (params: any) => {
  return http.post<any>(PORT1 + `/setcpt7conf`, params);
};
