import { Notification } from "src/entity/notification.entity"

export class NotificationRes {
    success: boolean

    data: Notification
}

export class NotificationDeleteRes {
    success: boolean

    data: boolean
}

export class NotificationListRes {
    success: boolean

    data: Notification[]
}