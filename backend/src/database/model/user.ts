import {Schema, model} from "mongoose";

const userSchema = new Schema({
    username : {type: String},
    points : {type: Number, default: 0},
    hashedPassword : {type: String}
})

export const User = model('User', userSchema);