import type { UserEntity } from '@/types/user.entity.ts'

export interface PublicationEntity{
  id: string;
  title: string;
  description: string;
  user_id: string;

  created_at: Date;
  updated_at: Date;

  User: UserEntity;
}

export interface PublicationRequest {
  title: string;
  description: string;
  user_id: string;
}