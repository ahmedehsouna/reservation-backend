import express from 'express';
import GuestsController from '../controllers/guests';
import { body} from 'express-validator';


const Router  = express.Router();

Router.route('')
.get(GuestsController.index)
.post(GuestsController.store)


Router.route('/:id')
.put([body('email').isEmail(), body('phone_number').isNumeric(), body('name').notEmpty()], GuestsController.update)
.delete(GuestsController.delete)


export default Router;






