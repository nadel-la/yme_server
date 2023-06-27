const { Mentee, Mentor, Category, Wishlist } = require("../models");
const { signToken, verifyToken } = require("../helpers/jwt");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { Op } = require("sequelize");
const { OAuth2Client } = require("google-auth-library");
const clientId = process.env.CLIENT_ID;

const midtransClient = require("midtrans-client");

const { google } = require("googleapis");
const oauth2Client = require("../middlewares/auth");

class MenteeController {
  static async getCalendarService() {
    return google.calendar({ version: "v3", auth: oauth2Client });
  }
  static async generateAuthUrl(req, res) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
    });

    res.redirect(authUrl);
  }

  static async createEvent(req, res) {
    const decoded = verifyToken(req.headers.token);
    oauth2Client.setCredentials(decoded.googleTokens);
    const calendar = await MenteeController.getCalendarService();
    const { eventTitle, date, startTime, city, postalCode } =
      req.body.dataInput;
    const startDateTime = new Date(date + "T" + startTime);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // add 1 hour

    const event = {
      summary: eventTitle,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Jakarta",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Jakarta",
      },
      location: `${city}, ${postalCode}`,
    };

    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  }

  static async handleAuthCode(req, res) {
    const { code } = req.query;
    console.log(code, "***");

    try {
      const client = new OAuth2Client(process.env.CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: code,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload();
      console.log(payload, "<<<***");
      const [user, created] = await Mentee.findOrCreate({
        where: { email: payload.email },
        defaults: {
          name: payload.name,
          password: "ngasalaja",
        },
        hooks: false,
      });

      const token = signToken({
        id: user.id,
        email: user.email,
        password: user.password,
      });

      res.redirect(
        `http://localhost:5173/booking-mentor?access_token=${token}`
      );
    } catch (error) {
      console.error(">>> Error handling auth code:", error, "<<<<");
      res.status(500).json({ message: "Failed to handle auth code" });
    }
  }

  static async register(req, res) {
    try {
      let { name, password, email, categoryId } = req.body;
      const createUser = await Mentee.create({
        name,
        password,
        email,
        categoryId,
      });
      res.status(201).json({
        id: createUser.id,
        name: createUser.name,
        email: createUser.email,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async login(req, res) {
    try {
      let { email, password } = req.body;
      if (!email) {
        throw { name: "invalidEmail" };
      }
      if (!password) {
        throw { name: "invalidPassword" };
      }

      let findMentee = await Mentee.findOne({
        where: {
          email,
        },
      });

      if (!findMentee) {
        throw { name: "invalid Email/Password" };
      }

      let validatePassword = comparePassword(password, findMentee.password);
      if (!validatePassword) {
        throw { name: "invalid Email/Password" };
      }

      let access_token = signToken({
        id: findMentee.id,
        name: findMentee.name,
        email: findMentee.email,
        password: findMentee.password,
      });

      res
        .status(200)
        .json({ name: findMentee.name, access_token: access_token });
    } catch (error) {
      if (error.name === "invalidEmail") {
        return res.status(400).json({ message: "Email is required" });
      }
      if (error.name === "invalidPassword") {
        return res.status(400).json({ message: "Password is required" });
      }
      if (error.name === "invalid Email/Password") {
        return res.status(401).json({ message: "Invalid email/password" });
      }
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async googleLogin(req, res, next) {
    console.log(req.headers, "<<<<<<,");
    try {
      let { googletoken } = req.headers;
      const client = new OAuth2Client(clientId);
      console.log(client, "client");
      const ticket = await client.verifyIdToken({
        idToken: googletoken,
        audience: clientId, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      console.log(ticket, "ticker");
      const payload = ticket.getPayload();
      const [user, created] = await Mentee.findOrCreate({
        where: { email: payload.email },
        defaults: {
          name: payload.name,
          password: "ngasalaja",
        },
        hooks: false,
      });

      const token = signToken({
        id: user.id,
        email: user.email,
        password: user.password,
      });
      res.status(200).json({ name: user.username, access_token: token });
      // console.log(user,'&&&&&&&&&&&&&');
      // console.log(created,'****');
    } catch (error) {
      next(error);
    }
  }

  static async fetchMentors(req, res) {
    try {
      const page = req.query.page ? +req.query.page - 1 : 0;
      const categoryId = req.query.categoryId || "";
      const limit = 6;
      const offset = limit * page;

      const mentors = await Mentor.findAndCountAll({
        where: categoryId
          ? {
              categoryId: {
                [Op.eq]: categoryId,
              },
            }
          : {},
        include: {
          model: Category,
        },
        offset,
        limit,
      });

      res.status(200).json(mentors);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async fetchWishlists(req, res) {
    try {
      let { id } = req.user;
      // console.log(id, "<<LKLKL");
      const findWishlist = await Wishlist.findAll({
        where: {
          menteeId: id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Mentor,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: Category,
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
        ],
      });
      res.status(200).json(findWishlist);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Internal Server Error` });
    }
  }

  static async addWishlist(req, res) {
    try {
      let { id } = req.user;
      let mentorId = req.params.id;
      // console.log(id, productId, "<<<<<<<<<<<<");
      // console.log(typeof productId);
      let findMentor = await Mentor.findByPk(mentorId);
      if (!findMentor) {
        throw { name: `dataNotFound` };
      }
      const createWishlist = await Wishlist.create({
        menteeId: id,
        mentorId,
      });
      res.status(201).json(createWishlist);
    } catch (error) {
      if (error.name === "dataNotFound") {
        return res.status(404).json({ message: "Data not found" });
      }
      console.log(error);
      res.status(500).json({ message: `Internal server error` });
    }
  }

  static async removeWishlist(req, res) {
    try {
      let id = req.params.id;
      let findWishlist = await Wishlist.findByPk(id);
      if (!findWishlist) {
        throw { name: "dataNotFound" };
      }
      let deleteWishlist = await Wishlist.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({ message: "Your wishlist deleted successfully" });
    } catch (error) {
      if (error.name === "dataNotFound") {
        return res.status(400).json({ message: `Data not found` });
      }
      console.log(error);
      res.status(500).json({ message: `Internal server error` });
    }
  }

  static async loginMentor(req, res) {
    try {
      let { email, password } = req.body;
      if (!email) {
        throw { name: "invalidEmail" };
      }
      if (!password) {
        throw { name: "invalidPassword" };
      }

      let findMentor = await Mentor.findOne({
        where: {
          email,
        },
      });

      if (!findMentor) {
        throw { name: "invalid Email/Password" };
      }

      let validatePassword = comparePassword(password, findMentor.password);
      if (!validatePassword) {
        throw { name: "invalid Email/Password" };
      }

      let access_token = signToken({
        id: findMentor.id,
        name: findMentor.name,
        email: findMentor.email,
        password: findMentor.password,
      });

      res
        .status(200)
        .json({ name: findMentor.name, access_token: access_token });
    } catch (error) {
      if (error.name === "invalidEmail") {
        return res.status(400).json({ message: "Email is required" });
      }
      if (error.name === "invalidPassword") {
        return res.status(400).json({ message: "Password is required" });
      }
      if (error.name === "invalid Email/Password") {
        return res.status(401).json({ message: "Invalid email/password" });
      }
      console.log(error);
      res.status(500).json({ message: `Internal server error` });
    }
  }

  static async MidtransToken(req, res) {
    let { price } = req.body;
    console.log(req.user.name, req.user.email, "<<<<");
    try {
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: `TRANSACTION_Yme_` + Math.floor(Math.random() * 1000000000),
          gross_amount: price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          name: req.user.name,
          email: req.user.email,
        },
      };

      const midtransToken = await snap.createTransaction(parameter);

      res.status(201).json(midtransToken);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = MenteeController;
