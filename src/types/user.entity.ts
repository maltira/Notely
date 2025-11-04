import type { GroupEntity } from '@/types/group.entity.ts'

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  groupID: string;
  isBlock: boolean;

  lastVisitTime: Date;
  createdAt: Date;
  updatedAt: Date;

  group: GroupEntity;
}