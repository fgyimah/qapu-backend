import { NotFound, NotAcceptable, BadRequest } from 'http-errors';
import mongoose from 'mongoose';
import { PasswordService } from '../services/password-service';
import { User, COLLECTION } from '../schemas/User';

export const UserModel = mongoose.model<User>(COLLECTION, User);

export async function getAllUsers(): Promise<User[]> {
  return await UserModel.find();
}

export async function getUserById(id: string): Promise<User> {
  const user = await UserModel.findById(id).populate('faculty');

  if (!user) {
    throw new NotFound('User with given ID not found');
  }

  return user;
}

export async function createUser(data: any): Promise<User> {
  const user = await UserModel.findOne({ email: data.email });

  if (user) {
    throw new NotAcceptable('User with email already exists');
  }

  const password = await PasswordService.toHash(data.password);
  return await UserModel.create({ ...data, password });
}

export async function loginUser(email: string, password: string): Promise<User> {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new NotFound('No user with given credentials');
  }

  const passMatch = await PasswordService.compare(user.password, password);
  if (!passMatch) {
    throw new BadRequest('Invalid credentials');
  }

  return user;
}

export async function deleteUser(id: string) {
  const user = await UserModel.findByIdAndDelete(id);

  if (!user) {
    throw new NotFound('User not found');
  }
}

export async function updateUserPassword(
  userId: string,
  newPassword: string,
  oldPassword: string
): Promise<User> {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFound('User not found');
  }

  const passMatch = await PasswordService.compare(user.password, oldPassword);
  if (!passMatch) {
    throw new BadRequest('Invalid old password');
  }

  const hashed = await PasswordService.toHash(newPassword);
  user.password = hashed;
  user.visited = true;

  await user.save();

  return user;
}
