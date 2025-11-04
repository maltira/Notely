import type { UserEntity } from '@/types/user.entity.ts'
import type { GroupEntity } from '@/types/group.entity.ts'

export interface AuthRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  message: string;
  token: string;
  user: UserEntity;
  userGroup: GroupEntity;
}
