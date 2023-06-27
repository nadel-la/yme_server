const CategoryController = require("../Controllers/categoryController");
const MenteeController = require("../Controllers/menteeController");
const { signToken, verifyToken } = require("../helpers/jwt");
const authentication = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/register", MenteeController.register);
router.post("/login", MenteeController.login);
router.post("/loginMentor", MenteeController.loginMentor);
router.get("/mentors", MenteeController.fetchMentors);
router.get("/categories", CategoryController.fetchCategories);

router.get("/auth/google", MenteeController.generateAuthUrl);
router.get("/auth/google/callback", MenteeController.handleAuthCode);
router.get("/google-login", MenteeController.googleLogin);

router.use(authentication);

router.post("/create-event", MenteeController.createEvent);
router.post("/generateMidtransToken", MenteeController.MidtransToken);
router.get("/wishlist", MenteeController.fetchWishlists);
router.post("/wishlist/:id", MenteeController.addWishlist);
router.delete("/wishlist/:id", MenteeController.removeWishlist);

module.exports = router;
