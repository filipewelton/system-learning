import { MultipartFile } from '@fastify/multipart'
import { ulid } from 'ulid'

import { InvalidDataInputException } from '__application/exceptions/invalid-data-input'
import { NotFoundException } from '__application/exceptions/not-found'
import { StudentRepository } from '__application/interfaces/student'
import { CloudStorageUploadRepository } from '__data/repositories/background-jobs/cloud-storage-upload'
import { Student } from '__data/schemas/student'
import { DEFAULT_USER_AVATAR_URL } from '__domain/constants/cloud-storage'

interface StudentAvatarUpload {
  student: Student
  file: Promise<MultipartFile | undefined>
}

const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
]

export class UploadStudentAvatar implements UseCase {
  constructor(
    private uploadRepository: CloudStorageUploadRepository,
    private studentRepository: StudentRepository,
  ) {}

  async call(params: StudentAvatarUpload) {
    const { file, student } = params
    const fileStream = await file

    if (!fileStream) {
      throw new NotFoundException('File is missing')
    }

    if (!allowedMimeTypes.includes(fileStream.mimetype)) {
      throw new InvalidDataInputException('File type accepted')
    }

    const { avatar } = student
    const extension = fileStream.filename.replace(/.+(?=\w{3}$)/, '')
    const fileContent = Buffer.from(fileStream.file.read()).toString('utf-8')

    let fileName: string

    if (avatar === DEFAULT_USER_AVATAR_URL) {
      fileName = `${ulid()}.${extension}`
    } else {
      fileName = avatar
        .replace(/^(public\/)/, '')
        .replace(/(\.\w{3})$/, '')
        .concat('.', extension)
    }

    await this.uploadRepository.call({
      fileContent,
      fileName,
      directory: 'public',
    })

    if (avatar === `public/${fileName}`) {
      return { student }
    }

    const newStorageRef = `public/${fileName}`

    const updatedStudent = await this.studentRepository.update({
      id: student.id,
      avatar: newStorageRef,
    })

    return { student: updatedStudent }
  }
}
