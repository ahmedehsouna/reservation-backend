import db from '../db/db';
import { Request, Response } from 'express';


export default {
    index: async (req:Request,res:Response) => {

        try{
            let guests = await db('guests').select('*')
            res.json({error: false, data:guests});
        }catch(err:any){
            res.json({error: true, message: err.message})
        }
    },

    store: async (req:Request,res:Response) => {
        try{
            let guest = await db('guests').insert({name:'Guest', email:'guest@', phone_number: '0912893829'})
            res.json({error: false, data:guest});
        }catch(err:any){
            res.json({error: true, message: err.message})
        }
    },

    update: async (req:Request,res:Response) => {
        try{
            let guest = await db('guests').where(req.params['id']).update({name:'Guest', email:'guest@', phone_number: '0912893829'}).returning('*')
            res.json({error: false, data:guest});
        }catch(err:any){
            res.json({error: true, message: err.message})
        }
    }

}

