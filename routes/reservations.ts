import express from 'express';
import ReservationsController from '../controllers/reservations';

const Router  = express.Router();

Router.route('')
.get(ReservationsController.index)
.post(ReservationsController.store)


Router.route('/:id')
.put(ReservationsController.update)
.delete(ReservationsController.delete)


export default Router;






