import { NotFound } from 'http-errors';
import mongoose from 'mongoose';
import { COLLECTION, Department } from '../schemas/Department';

export const DepartmentModel = mongoose.model<Department>(COLLECTION, Department);

export async function getAllDepartments(): Promise<Department[]> {
  return await DepartmentModel.find();
}

export async function getDepartmentById(id: string): Promise<Department> {
  const department = await DepartmentModel.findById(id);

  if (!department) {
    throw new NotFound();
  }

  return department;
}

export async function addDepartment(data: any): Promise<Department> {
  return await DepartmentModel.create(data);
}

export async function updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
  const department = await DepartmentModel.findByIdAndUpdate(id, data, { new: true });

  if (!department) {
    throw new NotFound();
  }

  return department;
}

export async function deleteDepartment(id: string) {
  const department = await DepartmentModel.findByIdAndDelete(id);

  if (!department) {
    throw new NotFound();
  }
}
