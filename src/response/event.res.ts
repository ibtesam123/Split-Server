import { Due } from "src/entity/due.entity"
import { Event } from "src/entity/event.entity"
import { Item } from "src/entity/item.entity"
import { User } from "src/entity/user.entity"

export class EventRes {
    success: boolean

    data: Event
}

export class EventListRes {
    success: boolean

    data: Event[]
}

export class EventDeleteRes {
    success: boolean

    data: boolean
}

export class ItemRes {
    success: boolean

    data: Item
}

export class ItemListRes {
    success: boolean

    data: Item[]
}

export class DueRes {
    success: boolean

    data: Due
}

export class DueListRes {
    success: boolean

    data: Due[]
}

export class EventInvitationSendRes {
    success: boolean

    data: User
}

export class EventInvitationAcceptRes {
    success: boolean

    data: Event
}