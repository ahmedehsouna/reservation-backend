import express from 'express';
import RoomsController from '../controllers/rooms';
import ReservationsController from '../controllers/reservations';


const Router  = express.Router();

Router.route('')
.get(RoomsController.index)
.post(RoomsController.store)


Router.route('/:id')
.get(RoomsController.show)
.put(RoomsController.update)
.delete(RoomsController.delete)


Router.get('/:id/reservations', ReservationsController.getRoomReservations)


export default Router;






