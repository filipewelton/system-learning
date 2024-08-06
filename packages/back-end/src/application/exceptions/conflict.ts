import { Exception } from './exception'

export class ConflictException extends Exception {
  status = 409
  name = 'ConflictException'
}
