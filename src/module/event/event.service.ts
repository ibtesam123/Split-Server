import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Due } from "src/entity/due.entity"
import { Event } from "src/entity/event.entity"
import { Item } from "src/entity/item.entity"
import { EventRes, EventListRes, ItemRes, DueRes, DueListRes, EventInvitationSendRes, EventInvitationAcceptRes, EventDeleteRes } from "src/response/event.res"
import { Logger } from "src/utils/logger.util"
import { CreateEventDTO, CreateItemDTO, EventInvitaionDTO, UpdateEventDTO } from "src/validation/event.dto"
import { In, Repository } from "typeorm"
import { UserService } from "../user/user.service"

export const module: string = 'Event'

@Injectable()
export class EventService {

    constructor(
        @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
        @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
        @InjectRepository(Due) private readonly dueRepo: Repository<Due>,
        private readonly userService: UserService,
    ) { }

    async getOne(id: number): Promise<EventRes> {

        let event = await this.eventRepo.createQueryBuilder('event')
            .leftJoinAndSelect('event.users', 'user')
            .leftJoinAndSelect('event.items', 'item')
            .leftJoinAndSelect('item.paidFor', 'paidFor')
            .leftJoinAndSelect('item.paidBy', 'paidBy')
            .whereInIds([id])
            .getOne()

        if (!event)
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: event,
        }

    }

    async getAllForUser(userID: number): Promise<EventListRes> {

        let user = (await this.userService.getOne(userID)).data

        let events = await this.eventRepo.createQueryBuilder('event')
            .leftJoinAndSelect('event.users', 'user')
            .where(`user.id=${userID}`)
            .getMany()


        return {
            success: true,
            data: events,
        }
    }

    async create(userID: number, eventDTO: CreateEventDTO): Promise<EventRes> {

        let user = (await this.userService.getOne(userID)).data

        let res = await this.eventRepo.insert({
            ...eventDTO,
            items: [],
        }).catch(({ message }) => {
            Logger(message, 'create', module)
            throw new HttpException('Cannot create event', HttpStatus.BAD_REQUEST)
        })

        let event = (await this.getOne(res.identifiers[0].id)).data

        event.users = [user]

        event = await this.eventRepo.save(event)

        return {
            success: true,
            data: event,
        }
    }

    async _calculateDues(eventID: number, item: Item, toPay: number): Promise<void> {

        let event = (await this.getOne(eventID)).data

        let user1 = item.paidBy

        await Promise.all(item.paidFor.map(async (user2) => {

            let existingDue = await this.dueRepo.findOne({
                where: {
                    user1,
                    user2,
                    event
                }
            })

            if (existingDue) {

                let totalRemaining = existingDue.amount - toPay

                if (totalRemaining === 0) {
                    await this.dueRepo.delete(existingDue.id)
                }
                else if (totalRemaining > 0) {
                    await this.dueRepo.update(existingDue.id, {
                        amount: totalRemaining,
                    })
                } else {

                    totalRemaining = totalRemaining * -1

                    await this.dueRepo.delete(existingDue.id)
                    await this.dueRepo.insert({
                        user1: user2,
                        user2: user1,
                        amount: totalRemaining,
                        event,
                    })
                }

            } else {
                await this.dueRepo.insert({
                    user1: user2,
                    user2: user1,
                    amount: toPay,
                    event
                })
            }
        }))



    }

    async getAllDuesForEvent(eventID: number): Promise<DueListRes> {

        let dues = await this.dueRepo.find({
            where: {
                event: {
                    id: eventID
                }
            },
            relations: [
                'user1',
                'user2'
            ]
        })

        return {
            success: true,
            data: dues
        }

    }

    async getOneItem(itemID: number): Promise<ItemRes> {

        let item = await this.itemRepo.findOne(itemID, {
            relations: [
                'paidBy',
                'paidFor'
            ]
        })

        if (!item)
            throw new HttpException('Item not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: item,
        }

    }

    async createItem(userID: number, itemDTO: CreateItemDTO): Promise<ItemRes> {

        let paidFor = (await this.userService.getByIDs(itemDTO.paidForIDs)).data
        delete itemDTO.paidForIDs

        let paidBy = (await this.userService.getOne(userID)).data

        let event = (await this.getOne(itemDTO.eventID)).data
        delete itemDTO.eventID

        //TODO: Create Icon

        let res = await this.itemRepo.insert({
            ...itemDTO,
            icon: 'icon',
            event,
            paidBy,
        }).catch(({ message }) => {
            Logger(message, 'createItem', module)
            throw new HttpException('Cannot create item', HttpStatus.BAD_REQUEST)
        })

        let item = (await this.getOneItem(res.identifiers[0].id)).data

        item.paidFor = paidFor

        item = await this.itemRepo.save(item)

        await this._calculateDues(event.id, item, (item.amount / (item.paidFor.length + 1)))

        return {
            success: true,
            data: item,
        }
    }

    async sendInvitation(inviDTO: EventInvitaionDTO): Promise<EventInvitationSendRes> {
        let user = (await this.userService.getOneWithUsername(inviDTO.username)).data

        let event = (await this.getOne(inviDTO.eventID)).data

        //TODO: Send notification to user

        return {
            success: true,
            data: user,
        }
    }

    async acceptInvitation(userID: number, eventID: number): Promise<EventInvitationAcceptRes> {

        let user = (await this.userService.getOne(userID)).data

        let event = (await this.getOne(eventID)).data

        event.users.push(user)

        event = await this.eventRepo.save(event)

        return {
            success: true,
            data: event,
        }
    }

    async update(eventID: number, eventDTO: UpdateEventDTO): Promise<EventRes> {

        let event = (await this.getOne(eventID)).data

        await this.eventRepo.update(eventID, {
            ...eventDTO,
        }).catch(({ message }) => {
            Logger(message, 'update', module)
            throw new HttpException('Cannot update event', HttpStatus.BAD_REQUEST)
        })

        event = (await this.getOne(eventID)).data

        return {
            success: true,
            data: event,
        }
    }

    async delete(eventID: number): Promise<EventDeleteRes> {

        let event = (await this.getOne(eventID)).data

        await this.eventRepo.delete(eventID)
            .catch(({ message }) => {
                Logger(message, 'delete', module)
                throw new HttpException('Cannot delete event', HttpStatus.BAD_REQUEST)
            })

        return {
            success: true,
            data: true,
        }
    }
}
