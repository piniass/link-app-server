import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        trim: true,
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
    },
    image: {
        url: String,
        public_id: String
    }
}, {
    timestamps: true
})

export default mongoose.model('User', userSchema); 