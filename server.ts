import express from 'express';
import cors from 'cors';
import routes from './routes/kviz';
import mongoDB from 'mongoose';
import User from './models/User';
import bodyParser from 'body-parser';
import { LocalStorage } from 'node-localstorage';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { RSA_NO_PADDING } from 'constants';

const app = express();

mongoDB.connect(
    process.env.DATABASE_CONNECT as string,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB'),
);
app.use(cors());
app.use(bodyParser());

app.use('/quiz', routes);

app.post('/register', (req: express.Request, res: express.Response) => {
    const usr = User.findOne(
        { name: req.body.username },
        (
            err,
            usr: {
                _id: string;
                name: string;
                password: string;
                points: number;
                __v: number;
            },
        ) => {
            if (usr) {
                return res.status(400).json({ error: 'Name taken' });
            } else {
                const user = new User({
                    name: req.body.username,
                    password: req.body.password,
                    points: 0,
                });

                user.save();
                jwt.sign(
                    {
                        name: req.body.username,
                        points: req.body.password,
                    },
                    'secrectkey',
                    (err: any, token: any) => {
                        res.status(200).json({
                            name: req.body.username,
                            points: req.body.password,
                            status: 'Logged in',
                            token,
                        });
                    },
                );
            }
        },
    );
});

app.get('/getPoints', async (req: express.Request, res: express.Response) => {
    const { name } = req.query;

    User.findOne(
        {
            name,
        },
        (err: Object, user: any) => {
            return res.json({ points: user.points });
        },
    );
});
app.put('/update', async (req: express.Request, res: express.Response) => {
    const { points } = req.body;
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')[1];
        jwt.verify(bearer, process.env.KEY_SECRET as string, (err, data) => {
            if (err) {
                res.status(403);
            } else {
                const getUser = async () => {
                    await User.findOne(
                        {
                            name: (data as { name: string }).name,
                        },
                        (err: object, user: any) => {
                            user.points += points;

                            user.save();
                            res.status(200).json({
                                user: user.name,
                                points: user.points,
                            });
                        },
                    ).exec();
                };
                getUser();
            }
        });
    } else {
        res.status(403);
    }
});
app.post('/login', async (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;

    await User.findOne(
        { name: username },
        (
            err: object,
            user: {
                _id: string;
                name: string;
                password: string;
                points: number;
                __v: number;
            },
        ) => {
            if (!user) return res.status(404).json({ error: 'Not found' });
            if (user.password === password) {
                jwt.sign(
                    {
                        name: user.name,
                        points: user.points,
                    },
                    process.env.KEY_SECRET as string,
                    (err: any, token: any) => {
                        res.status(200).json({
                            name: user.name,
                            points: user.points,
                            status: 'Logged in',
                            token,
                        });
                    },
                );
            } else {
                res.status(400).json({ status: 'Failed to login' });
            }
        },
    ).exec();
});
app.post('/verify', (req, res) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')[1];

        jwt.verify(bearer, process.env.KEY_SECRET as string, (err, data) => {
            if (err) {
                res.status(403);
            } else {
                res.status(200).json({ status: 'Approved', ...data });
            }
        });
    } else {
        res.status(403);
    }
});

app.listen(3000, () => console.log('Running server'));
