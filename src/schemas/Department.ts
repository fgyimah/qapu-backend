import { Document, Schema } from 'mongoose';
import { Faculty, COLLECTION as FACULTY } from './Faculty';

export const COLLECTION = 'departments';

export interface Department extends Document {
  name: string;
  faculty: Faculty | Faculty['_id'];
}

export const Department = new Schema({
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: FACULTY,
    required: true,
  },
});
