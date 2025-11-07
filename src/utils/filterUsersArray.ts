import type { UserEntity } from '@/types/user.entity.ts'

export const filterUsersArray = (arr: UserEntity[], type: 'id' | 'name' | 'email' | 'group' | 'status' | 'last_visit' = 'group'): UserEntity[] => {
  switch (type) {
    case "id":
      return [...arr].sort((a, b) => a.id.localeCompare(b.id))
    case "name":
      return [...arr].sort((a, b) => a.name.localeCompare(b.name))
    case "email":
      return [...arr].sort((a, b) => a.email.localeCompare(b.email))
    case "group":
      return [...arr].sort((a, b) => a.Group.name.localeCompare(b.Group.name))
    case "status":
      return [...arr].sort((a, b) => Number(a.is_block) - Number(b.is_block))
    case "last_visit":
      return [...arr].sort((a, b) => new Date(a.last_visit_at).getTime() - new Date(b.last_visit_at).getTime())
    default:
      return arr
  }
}