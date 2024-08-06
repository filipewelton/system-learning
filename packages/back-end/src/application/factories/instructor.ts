import { MultipartFile } from '@fastify/multipart'

import { instructorAvatarUploadDto } from '__application/dto/instructor-avatar-upload'
import { instructorCreationDto } from '__application/dto/instructor-creation'
import { instructorListingDto } from '__application/dto/instructor-listing'
import { instructorSearchByIdDto } from '__application/dto/instructor-search-by-id'
import { instructorSearchByNameDto } from '__application/dto/instructor-search-by-name'
import { instructorSessionCreationDto } from '__application/dto/instructor-session-creation'
import { instructorUpdateDto } from '__application/dto/instructor-update'
import { InstructorRepository } from '__application/interfaces/instructor'
import { ResultPageCountRepository } from '__application/interfaces/result-page-count'
import { CloudStorageUploadRepository } from '__data/repositories/background-jobs/cloud-storage-upload'
import { Instructor } from '__data/schemas/instructor'
import { CreateInstructor } from '__domain/use-cases/instructor/create'
import { CreateInstructorSession } from '__domain/use-cases/instructor/create-session'
import { FindAllInstructors } from '__domain/use-cases/instructor/find-all'
import { FindInstructorById } from '__domain/use-cases/instructor/find-by-id'
import { FindInstructorsByName } from '__domain/use-cases/instructor/find-by-name'
import { UpdateInstructor } from '__domain/use-cases/instructor/update'
import { UploadInstructorAvatar } from '__domain/use-cases/instructor/upload-avatar'

interface Creation {
  instructorRepository: InstructorRepository
  resultPageCountRepository: ResultPageCountRepository
  body: unknown
}

interface SessionCreation {
  instructorRepository: InstructorRepository
  body: unknown
}

interface Listing {
  instructorRepository: InstructorRepository
  routeQuery: unknown
}

interface Update {
  instructorRepository: InstructorRepository
  routeParams: unknown
  instructor: Instructor
  body: unknown
}

interface AvatarUpload {
  instructorRepository: InstructorRepository
  uploadRepository: CloudStorageUploadRepository
  routeParams: unknown
  instructor: Instructor
  file: Promise<MultipartFile | undefined>
}

interface SearchById {
  instructorRepository: InstructorRepository
  routeParams: unknown
}

interface GettingResultPageCount {
  resultPageCountRepository: ResultPageCountRepository
}

interface SearchByName {
  instructorRepository: InstructorRepository
  routeQuery: unknown
}

export class InstructorFactory {
  async create(params: Creation) {
    const { instructorRepository, resultPageCountRepository, body } = params
    const parsedBody = instructorCreationDto.parse(body)

    const useCase = new CreateInstructor(
      instructorRepository,
      resultPageCountRepository,
    )

    return useCase.call(parsedBody)
  }

  async createSession(params: SessionCreation) {
    const { body, instructorRepository } = params
    const { email } = instructorSessionCreationDto.parse(body)
    const useCase = new CreateInstructorSession(instructorRepository)

    return await useCase.call(email)
  }

  async findAll(params: Listing) {
    const { routeQuery, instructorRepository } = params
    const { page } = instructorListingDto.parse(routeQuery)
    const useCase = new FindAllInstructors(instructorRepository)

    return await useCase.call(page)
  }

  async update(params: Update) {
    const { body, routeParams, instructorRepository, instructor } = params

    const { body: parsedBody } = instructorUpdateDto.parse({
      routeParams,
      body,
    })

    const useCase = new UpdateInstructor(instructorRepository)

    return await useCase.call({
      instructor,
      payload: parsedBody,
    })
  }

  async uploadAvatar(params: AvatarUpload) {
    const {
      file,
      routeParams,
      instructorRepository,
      uploadRepository,
      instructor,
    } = params

    instructorAvatarUploadDto.parse(routeParams)

    const useCase = new UploadInstructorAvatar(
      uploadRepository,
      instructorRepository,
    )

    return await useCase.call({ instructor, file })
  }

  async findById(params: SearchById) {
    const { routeParams, instructorRepository } = params
    const { instructorId } = instructorSearchByIdDto.parse(routeParams)
    const useCase = new FindInstructorById(instructorRepository)

    return await useCase.call(instructorId)
  }

  async getResultPageCount(params: GettingResultPageCount) {
    const { resultPageCountRepository } = params

    const pageCount =
      await resultPageCountRepository.getResultPageCount('instructor')

    return { pageCount }
  }

  async findByName(params: SearchByName) {
    const { routeQuery, instructorRepository } = params
    const { name, page } = instructorSearchByNameDto.parse(routeQuery)
    const useCase = new FindInstructorsByName(instructorRepository)

    return await useCase.call({ name, page })
  }
}
