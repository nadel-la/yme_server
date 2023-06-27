const jwt = require("jsonwebtoken");
const { Mentee, Mentor } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  try {
    //! 1. Kita check dia bawa token atau tidak. (Menandakan dia udah login atau blm)
    // console.log(req.headers);
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "Invalid Token" };
    } else {
      // Kalo ada token, Token nya udah sesuai dengan yg di server kita apa ngga
      const decodeToken = verifyToken(access_token);
      // 3. Cari user, dia ada didatabase kita atau ngga
      const payload = await Mentee.findByPk(decodeToken.id);
      if (!payload) {
        throw { name: "Invalid Token" };
      }
      //Gausah pake else lagi, karena "ketika udah throw itu dia behaviournya mirip kayak return, jadi tidak menjalankan code dibawahnya, jadi bisa juga tidak pakai else, langsung aja"
      req.user = payload;
      // console.log(req.user, '<<<<<<<');
      next();
    }
  } catch (error) {
    if (error.name === "Invalid Token" || error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid Token" });
    }
    console.log(error);
  }
};

module.exports = authentication;
