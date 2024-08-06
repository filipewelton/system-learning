import { Exception } from './exception'

export class InvalidDataInputException extends Exception {
  status = 400
  name = 'InvalidDataInputException'
}
