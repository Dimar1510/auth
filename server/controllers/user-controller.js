const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const errorMessage = require("../utils/error-message");
const jwt = require("jsonwebtoken");

const UserController = {
  register: async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ error: "Field missing" });
    }

    try {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Register"));
    }
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Field missing" });
    }
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: "Wrong login or password" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ error: "Wrong login or password" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
      console.log(req.body);
      res.json({ token });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Login"));
    }
  },

  current: async (req, res, next) => {
    const userId = req.user.userId;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Current"));
    }
  },

  updateUser: async (req, res, next) => {
    const { id } = req.params;
    const { email, username, avatar, password } = req.body;

    if (id !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: { email },
        });

        if (!existingUser) {
          return res.status(400).json({ error: "User not found" });
        }

        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }

      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          username: username || undefined,
          avatar: avatar || undefined,
          password: hashedPassword,
        },
      });
      console.log(req.body, id);
      res.json(user);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Update"));
    }
  },
};

module.exports = UserController;
