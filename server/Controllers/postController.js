const Posts = require("../Modals/Posts");
const User = require("../Modals/User");
const { success, error } = require("../utils/responseWrapper");
const cloudinary=require('cloudinary').v2;
const {mapPostOutput} =require("../utils/utils");

const getAllPostsControllers = async (req, res) => {
    console.log(req._id); // ye middleware se aa rha hoga
    // return res.send('These are all the posts');
    return res.send(success(200, 'These are all the posts'));
}

const createPostController = async (req, res) => {
    try {
        const { caption ,postImg} = req.body;
        const owner = req._id;

        if(!caption || !postImg){
            return res.send(error(400,"caption and postImg are required"));
        }
           const cloudImg=await cloudinary.uploader.upload(postImg,{
                folder:'postImg'
            });

        

        const user = await User.findById(req._id);

        const post = await Posts.create({
            caption,
            owner,
            image :{
                publicId:cloudImg.public_id,
                url:cloudImg.secure_url
            }
        });

        user.posts.push(post._id);
        await user.save();

        console.log("post  - ", post);
        console.log("user  - ", user);

        return res.send(success(201, post));
    } catch (e) {
        return res.send(error(500, e.message));
        // console.log(e);
    }

}

const likeUnlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Posts.findById(postId).populate('owner');
        if (!post) {
            return res.send(error(404, "post not found"));
        }

        if (post.likes.includes(curUserId)) {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);
            // await post.save();
            // return res.send(success(200, "post unliked"));

        } else {
            post.likes.push(curUserId);
            // post.save();
            // return res.send(success(200, "post successfully liked"));
        }

            await  post.save();
            return res.send(success(200,{post : mapPostOutput(post,req._id)}));

    } catch (e) {
        return res.send(500, e.message);
    }
}

const updatePostController = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const curUserId = req._id;

        const post = await Posts.findById(postId);
        if (!post) {
            return res.send(error(404, "Post not found"))
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only owners can update"));
        }

        if (caption) {
            post.caption = caption;
        }
        await post.save();

        return res.send(success(200, { post }));

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const deletePostController = async (req, res) => {
        try {
            const { postId } = req.body;
            const curUserId = req._id;
        
            const post = await Posts.findById(postId);
            const curUser=await User.findById(curUserId);
            if (!post) {
                return res.send(error(404, "Post not found"))
            }
        
            if (post.owner.toString() !== curUserId) {
                return res.send(error(403, "Only owners can delete"));
            }
        
            const index=curUser.posts.indexOf(postId);
            curUser.posts.splice(index,1);
        
            await curUser.save();
            await  post.remove();
        
            return res.send(success(200,'Post deleted succesfully'));
        } catch (e) {
            return res.send(error(500, e.message));
        }
}

module.exports = { getAllPostsControllers, createPostController, likeUnlikePost, updatePostController,deletePostController }