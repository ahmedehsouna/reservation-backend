import express from 'express';
import GuestsController from '../controllers/guests';

const Router  = express.Router();

Router.route('')
.get(GuestsController.index)
.post(GuestsController.store)


Router.route('/:id')
.put(GuestsController.update)
.delete(GuestsController.delete)


export default Router;






