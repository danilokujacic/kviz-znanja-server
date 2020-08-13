import mongoose from 'mongoose';

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
});

export default mongoose.model('Korisnikci', user);
