// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    userName: string;
    password: string;
  }
  export interface ResLogin {
    accessToken: string;
    userInfo: any;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}

// */

export interface DialogProps {
	title: string;
	isView: boolean;
	rowData?: any;
	updateApi?: (params: any) => Promise<any>;
	queryApi?: (params?: any) => Promise<any>;
}

// 参照用户管理来定义设备管理所需接口

export namespace Device {
	export interface ReqDeviceParams extends ReqPage {
		dvcName: string;
		uid: number;
		dvcType: number;
		dvcHdInfo: string;
		dvcOsInfo: string;
		signConfig: string;
	}
	export interface ResDeviceList extends ReqDeviceParams {
		id: number;
		createdAt: string;
		updatedAt: string;
	}
	export interface DeviceType {
		typeLabel: string;
		typeValue: number;
	}
}

export namespace Signer {
	export interface ReqSignerParams extends ReqPage {
		signerName: string;
		signerDesc: string;
		signerCertSubject: string;
		signerCertCode: string;
		usedTimes: number;
	}
	export interface ResSignerList extends ReqSignerParams {
		id: number;
		createdAt: string;
		updatedAt: string;
	}
}

export namespace Log {
	export interface ReqLogParams extends ReqPage {
		logContent: string;
		logType: number;
		uid: number;
	}
	export interface ResLogList extends ReqLogParams {
		id: number;
		createdAt: string;
	}
}
