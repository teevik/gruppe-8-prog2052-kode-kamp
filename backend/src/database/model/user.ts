import {Schema, model} from "mongoose";

const userSchema = new Schema({
    username : String,
    points : Number,
    hashedPassword : String,
    email : String
})

const User = model('User', userSchema);

export {
    User
}