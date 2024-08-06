declare interface UseCase {
  call(params?: unknown): Promise<unknown>
}

declare type SessionCredentialRoles = 'instructor' | 'student' | 'system'
