import { Exception } from './exception'

export class UnauthorizedException extends Exception {
  status = 401
  name = 'UnauthorizedException'
}
