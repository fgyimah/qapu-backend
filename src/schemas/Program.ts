import { Schema, Document } from 'mongoose';
import { Department, COLLECTION as DEPARTMENT } from './Department';

export const COLLECTION = 'programmes';

export interface Program extends Document {
  name: string;
  accredited: boolean;
  type: 'undergraduate' | 'postgraduate';
  nextAccreditationDate?: Date;
  accreditationMaterials?: string[];
  accreditationRequirements?: string[];
  department: Department | Department['_id'];
}

export const Program = new Schema({
  name: {
    type: String,
    required: true,
  },
  accredited: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
  },
  nextAccreditationDate: Date,
  accreditationMaterials: [String],
  accreditationRequirements: [String],
  department: {
    type: Schema.Types.ObjectId,
    ref: DEPARTMENT,
    required: true,
  },
});
