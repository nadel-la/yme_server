const router = require("express").Router();

router.use("/api", require("./mentee"));

module.exports = router;
