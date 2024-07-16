// import { v4 as uuidv4 } from 'uuid';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
import express from 'express';

// import {
//   getOcrTextAllImages,
//   findImagesContainNutFact,
//   addUniqueString,
// } from '../../lib/server_utils';
import { prisma } from '../../server';
// import bodyParser from 'body-parser';
// import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// import { onProcessNut, onProcessOther } from '../../lib/google/gemini';

// import { uploadsDir } from '../../server';
import { error } from 'console';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user
    .findUnique({
      where: { email },
    })
    .catch((e: any) => {
      console.log('e', error);
      // res.json({ message: 'query fail' });
      // return;
    });

  console.log('user', user);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'development',
        secure: false,
        maxAge: 3600 * 10,
        sameSite: 'lax',
        path: '/',
      })
    );
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    const { password, ...createdUser } = user;

    res.status(201).json({
      data: createdUser,
      isSuccess: true,
      message: 'user created',
    });
  } catch (error) {
    console.log('err', error);
    res.status(400).json({ message: 'User registration failed', error });
  }
});

export default router;
