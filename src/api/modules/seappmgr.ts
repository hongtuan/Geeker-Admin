import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 1.0
export const getSeSnSrv = () => {
  return http.get<any>(PORT1 + `/getsesn`);
};

// 1.1
export const seRegSrv = (params: any) => {
  return http.post<any>(PORT1 + `/sereg`, params);
};
// 1.1.1
export const seLoadConfSrv = () => {
  return http.get<any>(PORT1 + `/seloadconf`);
};
// 1.2
export const appRegSrv = (params: any) => {
  return http.post<any>(PORT1 + `/appreg`, params);
};
// 1.2.1
export const appLoadConfSrv = () => {
  return http.get<any>(PORT1 + `/apploadconf`);
};
// 1.3
export const seTestSrv = (params: any) => {
  return http.post<any>(PORT1 + `/setest`, params);
};

//1.4
export const srvAuditSrv = (params: any) => {
  return http.post<any>(PORT1 + `/srvaudit`, params);
};
