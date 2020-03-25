
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

class UserController {

  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "fullname", "username", "email", "city", "phone", "collage", "role", "active", "createdAt", "updatedAt"] //We dont want to send the passwords on response
    });

    //Send the users object
    res.send({ message: 'User list successfully retrieved', data: users });
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ["id", "fullname", "username", "email", "city", "phone", "collage", "role", "active", "createdAt", "updatedAt"] //We dont want to send the passwords on response
      });
      res.send({ message: 'User successfully retrieved', data: user });
    } catch (error) {
      res.status(404).send({ message: "User not found" });
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { fullname, username, email, password, city, phone, collage, role, active } = req.body;
    let user = new User();
    user.fullname = fullname
    user.username = username;
    user.email = email
    user.password = password;
    user.city = city
    user.phone = phone
    user.collage = collage
    user.role = role.toUpperCase();
    user.active = active

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ message: 'Someting wrong!' });
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({ message: e.detail });
      return;
    }

    //If all ok, send 201 response
    res.status(201).send({ message: "User created" });
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { fullname, username, email, city, phone, collage, role, active } = req.body;

    //Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({ message: "User not found" });
      return;
    }

    //Validate the new values on model
    user.fullname = fullname
    user.username = username;
    user.email = email
    user.city = city
    user.phone = phone
    user.collage = collage
    user.role = role.toUpperCase();
    user.active = active
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ message: errors });
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({ message: "username already in use" });
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(200).send({ message: 'User successfully changed' });
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(200).send({ message: 'User successfully deleted' });
  };
};

export default UserController;
