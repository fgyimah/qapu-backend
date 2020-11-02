import { Router } from 'express';
import { AuthRole, secure } from '../middlewares/auth';
import * as Model from '../models/facultyModel';
import * as validation from '../validations/faculty-validations';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const faculties = await Model.getAllFaculties();
    res.json(faculties);
  } catch (error) {
    next(error);
  }
});

router.post('/', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    await validation.validateFaculty(req.body);

    const faculty = await Model.addFaculty(req.body);
    res.status(201).json(faculty);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    await validation.validateFaculty(req.body);

    const faculty = await Model.updateFaculty(req.params.id, req.body);
    res.status(201).json(faculty);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    const faculty = await Model.deleteFaculty(req.params.id);
    res.status(201).json(faculty);
  } catch (error) {
    next(error);
  }
});

export default { path: '/faculties', router };
