export abstract class Exception extends Error {
  abstract status: number
  abstract name: string

  constructor(
    public message: string,
    public reason?: unknown,
  ) {
    super(message)
  }
}
