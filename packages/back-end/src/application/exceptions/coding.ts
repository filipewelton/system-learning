import { Exception } from './exception'

export class CodingException extends Exception {
  status = 500
  name = 'CodingException'
}
