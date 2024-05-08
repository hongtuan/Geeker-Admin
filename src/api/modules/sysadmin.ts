import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

export const getLogContent = () => {
  return http.get<any>(PORT1 + `/viewlog`);
};
