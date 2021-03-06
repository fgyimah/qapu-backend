import { Router } from 'express';
import { AuthRole, secure } from '../middlewares/auth';
import { signToken } from '../utils/security';
import * as Model from '../models/userModel';
import * as validations from '../validations/auth-validations';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    await validations.validateRegisterUser(req.body);

    const user = await Model.createUser(req.body);

    const token = signToken(user._id, AuthRole.ADMIN);

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await validations.validateLoginUser(req.body);

    const user = await Model.loginUser(req.body.email, req.body.password);

    let token: string;
    if (user.isSuperAdmin) {
      token = signToken(user._id, AuthRole.SUPER_ADMIN);
    } else {
      token = signToken(user._id, AuthRole.ADMIN);
    }

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.put(
  '/update-password',
  secure([AuthRole.ADMIN, AuthRole.SUPER_ADMIN]),
  async (req, res, next) => {
    try {
      await validations.validateUpdatePassword(req.body);
      const userId = res.locals.jwt.jti;
      const user = await Model.updateUserPassword(
        userId,
        req.body.newPassword,
        req.body.oldPassword
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

export default { path: '/auth', router };
