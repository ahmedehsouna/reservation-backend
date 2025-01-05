import express from 'express';

const Router  = express.Router();

Router.route('').get((req, res) => {
    res.json({success:true})
})


export default Router;






