import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IdGuard } from 'src/guard/id.guard';
import { DueListRes, EventDeleteRes, EventInvitationAcceptRes, EventInvitationSendRes, EventListRes, EventRes, ItemRes } from 'src/response/event.res';
import { CreateEventDTO, CreateItemDTO, EventInvitaionDTO, UpdateEventDTO } from 'src/validation/event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
    constructor(
        private readonly eventService: EventService,
    ) { }

    @Get('due/:eventID')
    getAllDuesForEvent(@Param('eventID') eventID: number): Promise<DueListRes> {
        return this.eventService.getAllDuesForEvent(eventID)
    }

    @Get('item/:itemID')
    getOneItem(@Param('itemID') itemID: number): Promise<ItemRes> {
        return this.eventService.getOneItem(itemID)
    }

    @Get(':eventID')
    getOne(@Param('eventID') id: number): Promise<EventRes> {
        return this.eventService.getOne(id)
    }

    @Get()
    @UseGuards(IdGuard)
    getAllForUser(@Param('id') userID: number): Promise<EventListRes> {
        return this.eventService.getAllForUser(userID)
    }

    @Post('item')
    @UseGuards(IdGuard)
    createItem(@Param('id') userID: number, @Body() itemDTO: CreateItemDTO): Promise<ItemRes> {
        return this.eventService.createItem(userID, itemDTO)
    }

    @Post('sendInvitation')
    @UseGuards(IdGuard)
    sendInvitation(@Body() inviDTO: EventInvitaionDTO): Promise<EventInvitationSendRes> {
        return this.eventService.sendInvitation(inviDTO)
    }

    @Post('acceptInvitation/:eventID')
    @UseGuards(IdGuard)
    acceptInvitation(@Param('id') userID: number, @Param('eventID') eventID: number): Promise<EventInvitationAcceptRes> {
        return this.eventService.acceptInvitation(userID, eventID)
    }

    @Post()
    @UseGuards(IdGuard)
    create(@Param('id') userID: number, @Body() eventDTO: CreateEventDTO): Promise<EventRes> {
        return this.eventService.create(userID, eventDTO)
    }

    @Put(':eventID')
    @UseGuards(IdGuard)
    update(@Param('eventID') eventID: number, @Body() eventDTO: UpdateEventDTO): Promise<EventRes> {
        return this.eventService.update(eventID, eventDTO)
    }

    @Delete(':eventID')
    @UseGuards(IdGuard)
    delete(@Param('eventID') eventID: number): Promise<EventDeleteRes> {
        return this.eventService.delete(eventID)
    }
}
