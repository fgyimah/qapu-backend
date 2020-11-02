import { Router } from 'express';
import { AuthRole, secure } from '../middlewares/auth';
import * as Model from '../models/departmentModel';
import * as validation from '../validations/department-validation';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const departments = await Model.getAllDepartments();
    res.json(departments);
  } catch (error) {
    next(error);
  }
});

router.post('/', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    await validation.validateDepartment(req.body);

    const department = await Model.addDepartment(req.body);
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    await validation.validateDepartment(req.body);

    const department = await Model.updateDepartment(req.params.id, req.body);
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    const department = await Model.deleteDepartment(req.params.id);
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
});

export default { path: '/departments', router };
