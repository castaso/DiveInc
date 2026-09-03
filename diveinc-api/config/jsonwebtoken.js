require('dotenv').config()

module.exports = {
  "development": {
    "tokenLife": process.env.TOKEN_LIFE || '1d',
    "tokenSecret": process.env.TOKEN_SECRET || "token-secret",
    "tokenLinkLife": process.env.TOKEN_LINK_LIFE || '1d',
    "tokenLinkSecret": process.env.TOKEN_LINK_SECRET || "token-link-secret",
    "refreshTokenLife": process.env.REFRESH_TOKEN_LIFE || '7d',
    "refreshTokenSecret": process.env.REFRESH_TOKEN_SECRET|| "refresh-token-secret"
  },
  "test": {
    "tokenLife": process.env.TOKEN_LIFE || '1d',
    "tokenSecret": process.env.TOKEN_SECRET || "token-secret",
    "tokenLinkLife": process.env.TOKEN_LINK_LIFE || '1d',
    "tokenLinkSecret": process.env.TOKEN_LINK_SECRET || "token-link-secret",
    "refreshTokenLife": process.env.REFRESH_TOKEN_LIFE || '7d',
    "refreshTokenSecret": process.env.REFRESH_TOKEN_SECRET|| "refresh-token-secret"
  },
  "production": {
    "tokenLife": process.env.TOKEN_LIFE || '1d',
    "tokenSecret": process.env.TOKEN_SECRET || "token-secret",
    "tokenLinkLife": process.env.TOKEN_LINK_LIFE || '1d',
    "tokenLinkSecret": process.env.TOKEN_LINK_SECRET || "token-link-secret",
    "refreshTokenLife": process.env.REFRESH_TOKEN_LIFE || '7d',
    "refreshTokenSecret": process.env.REFRESH_TOKEN_SECRET|| "refresh-token-secret"
  }
}
