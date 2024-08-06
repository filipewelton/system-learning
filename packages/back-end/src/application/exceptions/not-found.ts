import { Exception } from './exception'

export class NotFoundException extends Exception {
  status = 404
  name = 'NotFoundException'
}
