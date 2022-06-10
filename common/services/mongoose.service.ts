import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        useFindAndModify: false,
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        log('Intentando conectar MongoDB (Se reintentara si es necesario)');
        mongoose
            .connect('mongodb://localhost:27017/api-db', this.mongooseOptions)
            .then(() => {
                log('MongoDB esta conectado');
            })
            .catch((err) => {
                const retrySeconds = 5;
                log(
                    `Conexion MongoDB fallida  (Se intentara de nuevo #${++this
                        .count} despues de ${retrySeconds} segundos):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default new MongooseService();