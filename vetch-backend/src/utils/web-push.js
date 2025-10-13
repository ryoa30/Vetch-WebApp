const webpush = require("web-push");

const config = () => {
  webpush.setVapidDetails(
    `mailto:${process.env.MAIL_USERNAME}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
};

module.exports = config;
