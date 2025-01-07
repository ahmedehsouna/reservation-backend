import express from 'express';
import RoomsController from '../controllers/rooms';

const Router  = express.Router();

Router.route('')
.get(RoomsController.index)
.post(RoomsController.store)


Router.route('/:id')
.put(RoomsController.update)
.delete(RoomsController.delete)


export default Router;






