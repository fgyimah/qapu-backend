import { NotFound } from 'http-errors';
import mongoose from 'mongoose';
import { COLLECTION, Program } from '../schemas/Program';

export const ProgramModel = mongoose.model<Program>(COLLECTION, Program);

export async function getAllPrograms(department: string): Promise<Program[]> {
  return await ProgramModel.find({ department });
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

export async function addAccreditationMaterial(id: string, material: string): Promise<Program> {
  const program = await ProgramModel.findById(id);

  if (!program) {
    throw new NotFound();
  }

  const materials = program.accreditationMaterials || [];
  materials.push(material);

  program.accreditationMaterials = materials;
  await program.save();

  return program;
}

export async function deleteAccreditationMaterial(id: string, material: string): Promise<Program> {
  const program = await ProgramModel.findById(id);

  if (!program) {
    throw new NotFound();
  }

  const materials = program.accreditationMaterials || [];
  const index = materials.indexOf(material);

  if (index > -1) {
    materials.splice(index, 1);
  }

  program.accreditationMaterials = materials;
  await program.save();

  return program;
}
