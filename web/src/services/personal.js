import { UPLOADIMG, PERSONAL_EDIT} from '@/services/api'
import { request, METHOD, } from '@/utils/request'

export async function uploadImg(fields) {
  return request(UPLOADIMG, METHOD.POST, fields)
}

export async function edit(fields) {
  return request(PERSONAL_EDIT, METHOD.POST, fields)
}



export default {
  uploadImg,
  edit
}