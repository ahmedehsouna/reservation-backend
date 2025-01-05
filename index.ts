import express from 'express';
const app = express();
import guests_routes from './routes/guests';
import rooms_routes from './routes/rooms';
import reservations_routes from './routes/reservations';
import cors from 'cors';



app.use(cors())

app.get('', (req, res) => {res.json({success : true})})

app.use('/api/guests', guests_routes);
app.use('/api/rooms', rooms_routes);
app.use('/api/reservations', reservations_routes);

app.listen(3000);