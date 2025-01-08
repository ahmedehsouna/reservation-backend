import {db} from '../db/db';
import { Request, Response } from 'express';


export default {
    index: async (req:Request,res:Response) => {

        try{
            let [rooms, guests, reservations] = await Promise.all([
                db('rooms').where({active:true}).count().first(),
                db('guests').where({active:true}).count().first(),
                db('reservations').where({active:true}).count().first()
            ])
            // let guests = await
            res.json({error: false, data:{rooms:rooms, guests, reservations}});
        }catch(err:any){
            res.json({error: true, message: err.message})
        }
    },

 

}

