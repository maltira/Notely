import { ref } from 'vue'

export interface NotificationOptions {
  description: string
  duration?: number
}

interface NotificationItem extends NotificationOptions {
  id: number,
  exiting: boolean
}

const notifications = ref<NotificationItem[]>([])
let idCounter = 0

export function useNotification() {
  const showNotification = (options: NotificationOptions) => {
    const id = idCounter++
    const notification = {
      id,
      duration: 6000,
      exiting: false,
      ...options,
    }
    notifications.value.push(notification)
    if (notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }

  const removeNotification = (id: number) => {
    const notification = notifications.value.find(element => element.id === id)
    if (notification) {
      notification.exiting = true

      setTimeout(() => {
        const index = notifications.value.findIndex(element => element.id === id)
        if (index > -1) {
          notifications.value.splice(index, 1)
        }
      }, 300)
    }
  }

  const infoNotification = (description: string) => {
    showNotification({ description: description })
  }

  return {
    notifications,
    showNotification,
    removeNotification,
    infoNotification
  }
}