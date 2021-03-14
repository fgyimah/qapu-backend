import { NotFound } from 'http-errors';
import mongoose from 'mongoose';
import { COLLECTION, Faculty } from '../schemas/Faculty';
import { ProgramModel } from './programModel';

export const FacultyModel = mongoose.model<Faculty>(COLLECTION, Faculty);

export async function getAllFaculties(): Promise<any> {
  let data = await FacultyModel.aggregate([
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: 'faculty',
        as: 'departments',
      },
    },
  ]);
  const programs = await ProgramModel.find();
  return { faculties: data, programs };
}

export async function getFacultyById(id: string): Promise<Faculty> {
  const faculty = await FacultyModel.findById(id);

  if (!faculty) {
    throw new NotFound();
  }

  return faculty;
}

export async function addFaculty(data: any): Promise<Faculty> {
  return await FacultyModel.create(data);
}

export async function updateFaculty(id: string, data: Partial<Faculty>): Promise<Faculty> {
  const faculty = await FacultyModel.findByIdAndUpdate(id, data, { new: true });

  if (!faculty) {
    throw new NotFound();
  }

  return faculty;
}

export async function deleteFaculty(id: string) {
  const faculty = await FacultyModel.findByIdAndDelete(id);

  if (!faculty) {
    throw new NotFound();
  }
}
