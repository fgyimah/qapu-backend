import { DepartmentModel } from '../models/departmentModel';
import { FacultyModel } from '../models/facultyModel';
import { ProgramModel } from '../models/programModel';
import { UserModel } from '../models/userModel';
import { PasswordService } from '../services/password-service';

import faculties from './data/faculties.json';
import departments from './data/departments.json';
import programs from './data/programs.json';

export async function populateDb() {
  // populate faculties
  await FacultyModel.deleteMany({});
  await FacultyModel.insertMany(faculties);

  // populate departments
  await DepartmentModel.deleteMany({});
  await DepartmentModel.insertMany(departments);

  const count = await ProgramModel.countDocuments({});
  if (count === 0) {
    await ProgramModel.insertMany(programs);
  }

  const user = await UserModel.findOne({ isSuperAdmin: true });
  if (!user) {
    const username = process.env.SUPER_ADMIN_USERNAME!;
    const email = process.env.SUPER_ADMIN_EMAIL!;
    const fullName = process.env.SUPER_ADMIN_FULL_NAME!;
    const password = process.env.SUPER_ADMIN_PASSWORD!;
    const avatar = process.env.SUPER_ADMIN_AVATAR_URL;

    // hash password
    const hashed = await PasswordService.toHash(password);

    await UserModel.create({
      username,
      fullName,
      email,
      password: hashed,
      avatar,
      isSuperAdmin: true,
    });
  }
}
