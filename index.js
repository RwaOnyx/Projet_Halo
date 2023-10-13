import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './router.js';
import session from 'express-session';

const PORT = process.env.PORT;
const app = express();

app.use(session({
	secret: 'b7bae1bb-c40d-427e-989f-b43aeec2cafa',
	resave: false,
	saveUninitialized: true,
	cookie: {maxAge: 3600000}
}));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('public')); // gestion fichiers statiques

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

