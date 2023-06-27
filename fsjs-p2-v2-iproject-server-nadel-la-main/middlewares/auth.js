const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

google.options({ auth: oauth2Client });

module.exports = oauth2Client;
