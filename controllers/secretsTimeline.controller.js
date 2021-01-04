const Secret = require("../models/secrets.model.js");
const User = require("../models/user.model.js");
const log = require("../constants/bunyan.constant");

exports.showAllSecrets = async (req, res) => {
  try {
    const userPrivacy = await User.aggregate([
      {
        $lookup: {
          from: "secrets",
          localField: "user_id",
          foreignField: "user_id",
          as: "timeline",
        },
      },
      { $unwind: "$timeline" },
    ]);

    let data = [];
    userPrivacy.map((privacyCheck) => {
      if (privacyCheck.privacy === true) {
        let privateUser = {
          status: "Private User",
          secret: privacyCheck.timeline.secret,
          createdAt: privacyCheck.timeline.createdAt,
          secret_id: privacyCheck.timeline.secret_id,
        };
        data = [...data, privateUser];
      } else {
        let publicUser = {
          status: "Public User",
          name: privacyCheck.firstname + " " + privacyCheck.lastname,
          user_id: privacyCheck.user_id,
          secret: privacyCheck.timeline.secret,
          createdAt: privacyCheck.timeline.createdAt,
          secret_id: privacyCheck.timeline.secret_id,
        };
        data = [...data, publicUser];
      }
    });
    log.info(`Timeline: ${JSON.stringify(data, undefined, 4)}`);
    res.status(200).json({
      succes: true,
      message: `Timeline:`,
      timeline: data,
    });
  } catch (error) {
    log.error(`Error in showAllSecrets timeline fuction: ${error}`);
  }
};
