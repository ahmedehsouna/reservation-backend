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


export default Router;






