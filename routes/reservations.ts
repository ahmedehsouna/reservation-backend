import express from 'express';
import ReservationsController from '../controllers/reservations';
import { body } from 'express-validator';

const Router  = express.Router();

Router.route('')
.get(ReservationsController.index)
.post(body('guest_id').notEmpty() ,ReservationsController.store)


Router.route('/:id')
.put(ReservationsController.update)
.delete(ReservationsController.delete)


Router.get('/monthly', ReservationsController.countReservationsMonthly)
Router.get('/by-day', ReservationsController.getReservationsByDay)


export default Router;






