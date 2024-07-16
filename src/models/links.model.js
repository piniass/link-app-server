import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    pagina:{
        type: String,
        required:true,
        trim: true,
    },
    enlace:{
        type: String,
        required:true,
        unique:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    }
}, {
    timestamps: true
})

export default mongoose.model('Link', linkSchema); 