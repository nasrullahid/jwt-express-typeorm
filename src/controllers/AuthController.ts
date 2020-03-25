import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send({ message: 'Missing username or password' });
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send({ message: 'Username not found' });
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send({ message: 'Wrong password' });
      return;
    }

    //Sing JWT, valid for 1 hour
    const data = { userId: user.id, username: user.username, role: user.role }
    const token = jwt.sign(data, config.jwtSecret, { expiresIn: "1h" });

    // delete password and role
    delete user['password'];
    delete user['role'];

    //Send the jwt in the response
    res.send({ message: 'Login successfully', token: token, data: user });
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send({ message: 'Missing old password or new password' });
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send({ message: 'User not found' });
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send({ message: "Old password dosen't matchs" });
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ message: errors });
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(200).send({ message: 'New password successfully changed' });
  };

  static register = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { fullname, email, city, phone, collage, paket } = req.body;
    let user = new User();
    user.fullname = fullname
    user.username = email;
    user.email = email
    user.password = phone;
    user.city = city
    user.phone = phone
    user.collage = collage
    user.role = 'MEMBER';
    user.active = 1

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ message: 'Someting wrong!' });
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username, email or phone is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      const message = e.detail.replace(/Key |\(|\)/g, "")
      res.status(409).send({ message: message.replace('=', ' ') });
      return;
    }

    //If all ok, send 201 response
    res.status(201).send({ message: "User created" });
  };
}
export default AuthController;
