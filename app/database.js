import mongoose from 'mongoose';
import Constants from './config/constants';

mongoose.connect(Constants.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
    throw err;
});