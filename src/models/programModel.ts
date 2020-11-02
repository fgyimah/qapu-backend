import { NotFound } from 'http-errors';
import mongoose from 'mongoose';
import { COLLECTION, Program } from '../schemas/Program';

export const ProgramModel = mongoose.model<Program>(COLLECTION, Program);

export async function getAllPrograms(): Promise<Program[]> {
  return await ProgramModel.find();
}

export async function getProgramById(id: string): Promise<Program> {
  const program = await ProgramModel.findById(id);

  if (!program) {
    throw new NotFound();
  }

  return program;
}

export async function addProgram(data: any): Promise<Program> {
  return await ProgramModel.create(data);
}

export async function updateProgram(id: string, data: Partial<Program>): Promise<Program> {
  const program = await ProgramModel.findByIdAndUpdate(id, data, { new: true });

  if (!program) {
    throw new NotFound();
  }

  return program;
}

export async function deleteProgram(id: string) {
  const program = await ProgramModel.findByIdAndDelete(id);

  if (!program) {
    throw new NotFound();
  }
}
