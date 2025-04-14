// import { ResPage, Signer, Log } from "@/api/interface/index";
import { ResPage, Signer } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 获取用户列表
 */
export const getUseList = (params?: any) => {
  return http.post<any>(PORT1 + `/users/list`, params);
};

export const updateUseStatus = (uid: number, status: boolean) => {
  return http.get<any>(PORT1 + `/users/updatestatus/${uid}/${status}`);
};

export const updateUseRole = (uid: number, roleid: number) => {
  return http.put<any>(PORT1 + `/users/updaterole/${uid}/${roleid}`);
};

export const updateUseInfo = (params: any) => {
  return http.put<any>(PORT1 + `/users/updateuser`, params);
};

export const updateUsePassword = (uid: number, pwd: string) => {
  return http.put<any>(PORT1 + `/users/updatepwd/${uid}/${pwd}`);
};

export const addUser = (params: any) => {
  return http.post<any>(PORT1 + `/users/adduser`, params);
};

export const deleteUser = (uid: number) => {
  return http.delete<any>(PORT1 + `/users/delete/${uid}`);
};

/**
 * 获取角色列表
 */
export const getRoleList = (params: any) => {
  return http.post<any>(PORT1 + `/roles/list`, params);
};

/**
 * 获取角色编号、名称信息
 */
export const getRoleIdName = () => {
  return http.get<any>(PORT1 + `/roles/getidname`);
};

export const getRoleMenuData = (id: number) => {
  return http.get<any>(PORT1 + `/roles/loadmenu/${id}`);
};

export const getSystemInfo = () => {
  return http.get<any>(PORT1 + `/sysinfo/status`);
};

export const updateAuthMenu = (params: any) => {
  return http.put<any>(PORT1 + `/roles/updateauthmenu`, params);
};

export const addRole = (params: any) => {
  return http.post<any>(PORT1 + `/roles/addrole`, params);
};

export const updateRole = (params: any) => {
  return http.put<any>(PORT1 + `/roles/updaterole`, params);
};

export const deleteRole = (uid: number) => {
  return http.delete<any>(PORT1 + `/roles/delete/${uid}`);
};

/////////////////证书管理服务//////////////////
export const addSigner = (params: any) => {
  return http.post<any>(PORT1 + `/signer/add`, params);
};

export const deleteSigner = (id: number) => {
  return http.delete<any>(PORT1 + `/signer/delete/${id}`);
};

export const updateSigner = (params: any) => {
  return http.put<any>(PORT1 + `/signer/update`, params);
};

export const getSignerList = (params: Signer.ReqSignerParams) => {
  return http.post<ResPage<Signer.ResSignerList>>(PORT1 + `/signer/list`, params);
};

export const syncSigner = (id: number) => {
  return http.get<any>(PORT1 + `/signer/sync/${id}`);
};

export const getSignerListVL = () => {
  return http.get<any>(PORT1 + `/signer/listvl`);
};

export const getUserAssignedSigner = (uid: number) => {
  return http.get<any>(PORT1 + `/signer/getuas/${uid}`);
};

export const saveAssignedSigner = (uid: number, selectedSignerIds: any) => {
  // let param: any = { selectedCertIds };
  return http.post<any>(PORT1 + `/signer/savesigner/${uid}`, { selectedSignerIds });
};

// export const getLogList = (params: Signer.ReqSignerParams) => {
export const getLogList = (params: any) => {
  // return http.post<ResPage<Log.ResLogList>>(PORT1 + `/logs/list`, params);
  return http.post<any>(PORT1 + `/logs/list`, params);
};

export const getAdminIdName = () => {
  return http.get<any>(PORT1 + `/users/listidname`);
};

export const loadVssConfig = () => {
  return http.get<any>(PORT1 + `/vssconfig/load`);
};

export const testVssConfig = (params: any) => {
  return http.post<any>(PORT1 + `/vssconfig/test`, params);
};

export const saveVssConfig = (params: any) => {
  return http.post<any>(PORT1 + `/vssconfig/save`, params);
};
