const PostModel = require("../models/post.model");

exports.createPostController = async (req, res) => {
  try {
    const { desc, image_link } = req.body;
    let userId = req.user._id;

    const createPost = new PostModel({
      user: userId,
      desc,
      image_link,
    });

    if (!createPost) {
      return res.status(400).json({
        error: "Something went wrong!",
      });
    }

    await createPost.save();

    return res.status(201).json({
      message: "Post has been created successfully!",
      post: createPost,
    });
  } catch (error) {
    console.log("error in createPostController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.doLikeAndDislikeController = async (req, res) => {
  try {
    let selfId = req.user._id;
    let { postId } = req.body;

    let post = await PostModel.findById(postId);
    console.log("post:", post);

    if (!post) {
      return res.status(400).json({
        error: "No such post found!",
      });
    }

    const index = post.likes.findIndex((id) => id.equals(selfId));

    if (index !== -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(selfId);
    }

    await post.save();

    res.status(201).json({
      message: index !== -1 ? "Post unliked" : "Post liked",
      likes: post.likes,
    });
  } catch (error) {
    console.log("error in doLikeAndDislikeController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.getAllPostController = async (req, res) => {
  try {
    let posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password");

    res.status(200).json({
      message: "Successfully found all post!",
      posts,
    });
  } catch (error) {
    console.log("error in getAllPostController():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.getSinglePostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const singlePost = await PostModel.findById(postId).populate(
      "user",
      "-password"
    );

    if (!singlePost) {
      return res.status(404).json({
        error: "No such post found!",
      });
    }

    res.status(200).json({
      message: "Successfully post has been found!",
      posts: singlePost,
    });
  } catch (error) {
    console.log("error in getSinglePostById():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.getTop5PostForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const top5Post = await PostModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .limit(5);

    res.status(200).send({
      message: "Successfully found top 5 post!",
      top5Post,
    });
  } catch (error) {
    console.log("error in getTop5PostForUser():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

exports.getAllPostForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await PostModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "-password");

    res.status(200).send({
      message: "Successfully found all post!",
      posts,
    });
  } catch (error) {
    console.log("error in getAllPostForUser():", error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};
