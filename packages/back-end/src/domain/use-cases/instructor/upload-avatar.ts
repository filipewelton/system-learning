import { MultipartFile } from '@fastify/multipart'
import { ulid } from 'ulid'

import { InvalidDataInputException } from '__application/exceptions/invalid-data-input'
import { NotFoundException } from '__application/exceptions/not-found'
import { InstructorRepository } from '__application/interfaces/instructor'
import { CloudStorageUploadRepository } from '__data/repositories/background-jobs/cloud-storage-upload'
import { Instructor } from '__data/schemas/instructor'
import { DEFAULT_USER_AVATAR_URL } from '__domain/constants/cloud-storage'

interface InstructorAvatarUpload {
  instructor: Instructor
  file: Promise<MultipartFile | undefined>
}

const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
]

export class UploadInstructorAvatar implements UseCase {
  constructor(
    private uploadRepository: CloudStorageUploadRepository,
    private instructorRepository: InstructorRepository,
  ) {}

  async call(params: InstructorAvatarUpload) {
    const { file, instructor } = params
    const fileStream = await file

    if (!fileStream) {
      throw new NotFoundException('File is missing')
    }

    if (!allowedMimeTypes.includes(fileStream.mimetype)) {
      throw new InvalidDataInputException('File type accepted')
    }

    const { avatar } = instructor
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
      return { instructor }
    }

    const newStorageRef = `public/${fileName}`

    const updatedInstructor = await this.instructorRepository.update({
      id: instructor.id,
      avatar: newStorageRef,
    })

    return { instructor: updatedInstructor }
  }
}
