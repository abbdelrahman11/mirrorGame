import {Schema, model} from 'mongoose';

export interface doctor{
    id:string;
    email:string;
    password: string;
    name:string;
    ID_NO:string;
}

export const doctorsSchema = new Schema<doctor>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    ID_NO: {type: String, required: true},
}, {
    timestamps: true,
    toJSON:{
        virtuals: true
    },
    toObject:{
        virtuals: true
    }
});

export const doctorsModel = model<doctor>('doctors', doctorsSchema);