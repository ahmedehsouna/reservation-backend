import express from 'express';
import HomeController from '../controllers/home';

const Router  = express.Router();

Router.route('')
.get(HomeController.index)


export default Router;






