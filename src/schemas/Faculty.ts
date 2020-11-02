import { Document, Schema } from 'mongoose';

export const COLLECTION = 'faculties';

export interface Faculty extends Document {
  name: string;
}

export const Faculty = new Schema({
  name: {
    type: String,
    required: true,
  },
});
