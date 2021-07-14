import { LOGIN, GETCODE, REGISTER, CODECHECK } from '@/services/api'
import { request, METHOD, } from '@/utils/request'

// export async function list(queryParam, formParam) {
//   return request(LOGIN, METHOD.POST, formParam, queryParam)
// }
export async function login(fields) {
  return request(LOGIN, METHOD.POST, fields)
}

export async function register(fields) {
  return request(REGISTER, METHOD.POST, fields)
}

export async function getcode(phone) {
  return request(GETCODE, METHOD.POST, phone)
}

export async function codecheck(fields) {
  return request(CODECHECK, METHOD.POST, fields)
}




export default {
  login,
  getcode,
  register,
  codecheck
}