import { MultipartFile } from '@fastify/multipart'

import { studentAvatarUploadDto } from '__application/dto/student-avatar-upload'
import { studentCreationDto } from '__application/dto/student-creation'
import { studentSessionCreationDto } from '__application/dto/student-session-creation'
import { studentUpdateDto } from '__application/dto/student-update'
import { ResultPageCountRepository } from '__application/interfaces/result-page-count'
import { StudentRepository } from '__application/interfaces/student'
import { CloudStorageUploadRepository } from '__data/repositories/background-jobs/cloud-storage-upload'
import { Student } from '__data/schemas/student'
import { CreateStudent } from '__domain/use-cases/student/create'
import { CreateStudentSession } from '__domain/use-cases/student/create-session'
import { UpdateStudent } from '__domain/use-cases/student/update'
import { UploadStudentAvatar } from '__domain/use-cases/student/upload-avatar'

interface StudentCreation {
  studentRepository: StudentRepository
  resultPageCountRepository: ResultPageCountRepository
  body: unknown
}

interface GettingResultPageCount {
  resultPageCountRepository: ResultPageCountRepository
}

interface StudentSessionCreation {
  studentRepository: StudentRepository
  body: unknown
}

interface StudentUpdate {
  studentRepository: StudentRepository
  routeParams: unknown
  body: unknown
  student: Student
}

interface AvatarUpload {
  studentRepository: StudentRepository
  uploadRepository: CloudStorageUploadRepository
  routeParams: unknown
  student: Student
  file: Promise<MultipartFile | undefined>
}

export class StudentFactory {
  async create(params: StudentCreation) {
    const { body, studentRepository, resultPageCountRepository } = params
    const parsedBody = studentCreationDto.parse(body)

    const useCase = new CreateStudent(
      studentRepository,
      resultPageCountRepository,
    )

    await useCase.call(parsedBody)
  }

  async getResultPageCount(params: GettingResultPageCount) {
    const { resultPageCountRepository } = params

    const pageCount =
      await resultPageCountRepository.getResultPageCount('student')

    return { pageCount }
  }

  async createSession(params: StudentSessionCreation) {
    const { body, studentRepository } = params
    const { email } = studentSessionCreationDto.parse(body)
    const useCase = new CreateStudentSession(studentRepository)

    return await useCase.call(email)
  }

  async update(params: StudentUpdate) {
    const { body, routeParams, studentRepository, student } = params

    const { body: parsedBody } = studentUpdateDto.parse({ routeParams, body })

    const useCase = new UpdateStudent(studentRepository)

    return await useCase.call({
      student,
      payload: parsedBody,
    })
  }

  async uploadAvatar(params: AvatarUpload) {
    const { file, routeParams, studentRepository, uploadRepository, student } =
      params

    studentAvatarUploadDto.parse(routeParams)

    const useCase = new UploadStudentAvatar(uploadRepository, studentRepository)

    return await useCase.call({ student, file })
  }
}
