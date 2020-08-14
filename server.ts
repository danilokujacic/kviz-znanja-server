import express from 'express';
import cors from 'cors';
import routes from './routes/kviz';
import mongoDB from 'mongoose';
import User from './models/User';
import bodyParser from 'body-parser';
import { LocalStorage } from 'node-localstorage';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { RSA_NO_PADDING } from 'constants';
import { setupMaster } from 'cluster';

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
                const setUser = async () => {
                    const hashedPassword = await bcrypt.hash(
                        req.body.password,
                        6,
                    );
                    console.log(hashedPassword);
                    const user = new User({
                        name: req.body.username,
                        password: hashedPassword,
                        points: 0,
                    });

                    user.save();

                    jwt.sign(
                        {
                            name: req.body.username,
                            points: req.body.points,
                        },
                        'secrectkey',
                        (err: any, token: any) => {
                            res.status(200).json({
                                name: req.body.username,
                                points: req.body.points,
                                status: 'Logged in',
                                token,
                            });
                        },
                    );
                };
                setUser();
            }
        },
    );
});

app.get('/getList', async (req: express.Request, res: express.Response) => {
    User.find((err, data) => {
        if (!err) {
            res.status(200).json({
                data,
            });
        }
    });
});
app.get('/getUser', async (req: express.Request, res: express.Response) => {
    const { name } = req.query;

    User.findOne(
        {
            name,
        },
        (err: Object, user: any) => {
            return res.json({ name: user.name, points: user.points });
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
        jwt.verify(bearer, 'secrectkey', (err, data) => {
            if (err) {
                res.status(403);
            } else {
                const getUser = async () => {
                    await User.findOne(
                        {
                            name: (data as { name: string }).name,
                        },
                        (err: object, user: any) => {
                            console.log(points);
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
            const comparison = bcrypt.compare(user.password, password);
            if (comparison) {
                jwt.sign(
                    {
                        name: user.name,
                        points: user.points,
                    },
                    'secrectkey',
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

        jwt.verify(bearer, 'secrectkey', (err, data) => {
            if (err) {
                res.status(403);
            } else {
                User.findOne(
                    {
                        name: (data as { name: string }).name,
                    },
                    (err, usr: { points: number }) => {
                        if (err) {
                            res.status(403);
                        } else {
                            res.status(200).json({
                                status: 'Approved',
                                ...data,
                                points: usr!.points,
                            });
                        }
                    },
                );
            }
        });
    } else {
        res.status(403);
    }
});

app.listen(3000, () => console.log('Running server'));
