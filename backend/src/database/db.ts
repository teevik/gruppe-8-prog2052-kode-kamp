import mongoose, {Mongoose} from 'mongoose'
const {DATABASE_URL} = process.env;

export default async function connectdb() : Promise<Mongoose> {
    if(!DATABASE_URL){
        throw new Error("Could not find DATABASE_URL env variable")
    }
    return await mongoose.connect(DATABASE_URL);
    // await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');
}