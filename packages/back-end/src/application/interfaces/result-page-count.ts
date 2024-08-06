export type Contexts = 'instructor' | 'student'

export interface ResultPageCountRepository {
  increaseResultPageCount(context: Contexts): Promise<void>
  getResultPageCount(context: Contexts): Promise<number>
}
