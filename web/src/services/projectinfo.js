import { PROJECTINFO_LIST, PROJECTINFO_EDIT, PROJECTINFO_GETBYID, PROJECTINFO_REMOVE, PROJECTINFO_BATCHREMOVE, PROJECTINFO_GETBYUSERNAME} from '@/services/api'
import { request, METHOD, } from '@/utils/request'


export async function list(pageParams, queryParam) {
  return request(PROJECTINFO_LIST, METHOD.POST, pageParams, queryParam)
}

export async function getByid(id) {
  return request(PROJECTINFO_GETBYID, METHOD.GET,id)
}

// 根据所登录的用户查看相应的项目
export async function getByuserName() {
  return request(PROJECTINFO_GETBYUSERNAME, METHOD.GET)
}

export async function remove(id) {
  return request(PROJECTINFO_REMOVE, METHOD.GET, id)
}

export async function batchRemove(ids) {
  return request(PROJECTINFO_BATCHREMOVE, METHOD.POST, ids)
}

export async function edit(fields) {
  return request(PROJECTINFO_EDIT, METHOD.POST, fields)
}



export default {
  list,
  edit,
  getByid,
  remove,
  batchRemove,
  getByuserName
}