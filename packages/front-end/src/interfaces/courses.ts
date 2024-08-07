export interface Course {
  id: string
  title: string
  description: string
  category: string
  cover: string
  duration: number
  createdAt: Date
  updatedAt: Date | null
  instructorId: string
}
