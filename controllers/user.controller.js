const UserModel = require("../models/user.model");
const NotificationModel = require("../models/notification.model");
const bcryptjs = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.registerController = async (req, res) => {
  try {
    let { email, password, f_name } = req.body;
    let isUserExist = await UserModel.findOne({ email });
    console.log("isUserExist:", isUserExist);

    if (isUserExist) {
      return res.status(400).json({
        error:
          "Already haven an account with this email. Please try again with other email!",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await new UserModel({
      email,
      password: hashedPassword,
      f_name,
    }).save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.log("error in registerController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      return res.status(400).json({
        error: "Invalid credentials. Please try again!",
      });
    }

    const isPasswordSame = await bcryptjs.compare(password, userExist.password);

    if (!isPasswordSame) {
      return res.status(400).json({
        error: "Invalid credentials. Please try again!",
      });
    }

    let token = jwt.sign(
      { userId: userExist._id },
      process.env.JWT_SECRECT_KEY
    );

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
      user: userExist,
    });
  } catch (error) {
    console.log("error in loginController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.loginThroughGoogleController = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email, name, picture } = payload;

    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      userExist = await UserModel.create({
        googleId: sub,
        email,
        f_name: name,
        profile_pic: picture,
      });
    }

    let loginToken = jwt.sign(
      { userId: userExist._id },
      process.env.JWT_SECRECT_KEY
    );

    res.cookie("token", loginToken, cookieOptions);

    return res.status(200).json({
      message: "User has logged in successfully",
      user: userExist,
      success: true,
    });
  } catch (error) {
    console.log("error in loginThroughGoogleController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.updateUserController = async (req, res) => {
  try {
    const { user } = req.body;
    const isExist = await UserModel.findById(req.user._id);

    if (!isExist) {
      return res.status(404).json({
        error: "User doesn't exist ",
      });
    }

    const updateData = await UserModel.findByIdAndUpdate(isExist._id, user);
    const userData = await UserModel.findById(req.user._id);

    res.status(201).json({
      message: "User data has been updated successfully!",
      user: userData,
    });
  } catch (error) {
    console.log("error in updateUserController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const isExist = await UserModel.findById(id);

    if (!isExist) {
      return res.status(400).json({
        error: "No such user exist",
      });
    }

    return res.status(200).json({
      message: "User has been fetched successfully!",
      user: isExist,
    });
  } catch (error) {
    console.log("error in updateUserController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.logOutUserController = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.log("error in logOutUserController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.findUserWhileSearchingController = async (req, res) => {
    try {
      let { query } = req.query;
      const users = await UserModel.find({
        $and: [
          { _id: {$ne: req.user._id}},
          {$or: [
            { f_name: { $regex: new RegExp(`^${query}`, 'i')}},
            { email: { $regex: new RegExp(`^${query}`, 'i')}},
          ]}
        ]
      })

      res.status(200).json({
        message: 'fetched member',

        users
      })
    } catch (error) {
        console.log("error in findUserWhileSearchingController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.sendFriendRequestController = async (req, res) => {
    try {
      const sender = req.user._id;
      const { reciever } = req.body;

      const userExist = await UserModel.findById(reciever);
      if(!userExist) {
        return res.status(404).json({
          error: 'No such user exist'
        })
      }

      const index = req.user.friends.findIndex(id => id.equals(reciever));
      if(index !== -1) {
        return res.status(404).json({
          error: 'Already Friend'
        })
      }

      const lastIndex = userExist.pending_friends.findIndex(id => id.equals(req.user._id));

      if(lastIndex !== -1) {
        return res.status(404).json({
          error: 'Already sent request'
        })
      }

      userExist.pending_friends.push(sender);
      let content = `${req.user.f_name} has sent you friend request`;

      const notification = new NotificationModel({
        sender,
        reciever,
        content,
        type: "friendRequest"
      })
      await notification.save();
      await userExist.save();

      res.status(200).json({
        message: 'Friend request sent'
      })

    } catch (error) {
        console.log("error in sendFriendRequestController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.acceptFriendRequestController = async (req, res) => {
    try {
      let { friendId } = req.body;
      let selfId = req.user._id;

      const friendData = await UserModel.findById(friendId);

      if(!friendData) {
        return res.status(404).json({
          error: 'So such user exist.'
        })
      }

      const index = req.user.pending_friends.findIndex(id => id.equals(friendId));

      if(index !== -1) {
        req.user.pending_friends.splice(index, 1);
      } else {
        return res.status(404).json({
          error: 'No any request from such user!'
        })
      }

      req.user.friends.push(friendId);
      friendData.friends.push(req.user._id);

      let content = `${req.user.f_name} has accepted your friend request`;
      const notification = new NotificationModel({
        sender: req.user._id,
        reciever: friendId,
        content,
        type: "friendRequest"
      })
      await notification.save();
      await friendData.save();

      await req.user.save();

      return res.status(200).json({
        message: 'You both are connected now.'
      })

    } catch (error) {
        console.log("error in acceptFriendRequestController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.getAllFriendsController = async (req, res) => {
    try {
      let friendList = await req.user.populate("friends");

      res.status(200).json({
        message: "Successfully found all friend list!",
        friends: friendList.friends
      })
    } catch (error) {
        console.log("error in getAllFriendsController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.getPendingFriendController = async (req, res) => {
    try {
      let pendingFriendsList = await req.user.populate("pending_friends");

      res.status(200).json({
        message: "Successfully found all pending request!",
        pendingFriends: pendingFriendsList.pending_friends
      })
    } catch (error) {
        console.log("error in getPendingFriendController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.removeFriendFromListController = async (req, res) => {
    try {
      let selfId = req.user._id;
      let { friendId } = req.params;

      const friendData = await UserModel.findById(friendId);
      if(!friendData) {
        return res.status(404).json({
          error: 'No such user exist'
        })
      }

      const index = req.user.friends.findIndex(id => id.equals(friendId));
      const friendIndex = friendData.friends.findIndex(id => id.equals(selfId));

      if(index !== -1) {
        req.user.friends.splice(index, 1);
      } else {
        return res.status(400).json({
          error: 'No any request from such user!'
        })
      }

      if(friendIndex !== -1) {
        friendData.friends.splice(friendIndex, 1)
      } else {
        return res.status(404).json({
          error: 'No any request from such user!'
        })
      }

      await req.user.save();
      await friendData.save();

      res.status(200).json({
        message: "You both are disconnected now!"
      })
    } catch (error) {
        console.log("error in removeFriendFromListController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}