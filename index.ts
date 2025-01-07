import express from 'express';
const app = express();
import guests_routes from './routes/guests';
import rooms_routes from './routes/rooms';
import reservations_routes from './routes/reservations';
import home_routes from './routes/home';
import cors from 'cors';
import bodyParser from 'body-parser';



app.use(cors())

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }))
app.get('', (req, res) => {res.json({success : true})})


app.use('/api/home', home_routes);

app.use('/api/guests', guests_routes);
app.use('/api/rooms', rooms_routes);
app.use('/api/reservations', reservations_routes);

app.listen(3000);