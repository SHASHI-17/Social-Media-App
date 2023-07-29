const Posts = require("../Modals/Posts");
const User = require("../Modals/User");
const { error, success } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/utils");

const cloudinary = require('cloudinary').v2;

const followOrUnfollowUserController = async (req, res) => {


    try {
        const { userIdToFollow } = req.body;
        const curUserId = req._id;

        const userToFollow = await User.findById(userIdToFollow);
        const curUser = await User.findById(curUserId);

        if (!userToFollow) {
            return res.send(error(404, "user to follow not found"));
        }

        if (curUserId === userIdToFollow) {
            return res.send(error(409, "Cannot follow yourself ..find anyone else"));
        }

        if (curUser.followings.includes(userIdToFollow)) {
            const followingIndex = curUser.followings.indexOf(userIdToFollow);
            curUser.followings.splice(followingIndex, 1);

            const followerIndex = userToFollow.followers.indexOf(curUser);
            userToFollow.followers.splice(followerIndex, 1);

            await userToFollow.save();
            await curUser.save();

            // return res.send(success(200, "User Unfollowed"))

        } else {

            userToFollow.followers.push(curUserId);
            curUser.followings.push(userIdToFollow);

            await userToFollow.save();
            await curUser.save();

            // return res.send(success(200, "User Followed"))
        }

        return res.send(success(200,{user:userToFollow}));
    } catch (e) {
        return res.send(error(500, e.message));
    }

}


const getFeedData = async (req, res) => {
    try {
        const curUserId = req._id;

        const curUser = await User.findById(curUserId).populate('followings');
        // console.log("aane de",curUser);
        const fullPosts = await Posts.find({
            owner: {
                '$in': curUser.followings  // this is used for this case '$in'
            }
        }).populate('owner');

        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        const followingsIds = curUser.followings.map((item) =>  item._id );  
        // followingsIds.push(req._id); 
        console.log("followingsIds",followingsIds);
        const suggestions = await User.find({
            // _id :{
            //     "$nin" :followingsIds  
            // }
            "$and": [{ _id: { "$ne": req._id  } }, { _id: { "$nin": followingsIds } }]

        })
        console.log("suggestions shuru", suggestions);
        return res.send(success(200, { ...curUser._doc, suggestions, posts }));

    } catch (e) {
        return res.send(error(500, e.message));
    }
}


const getMyPosts = async (req, res) => {

    try {
        const curUserId = req._id;

        const allUserPosts = await Posts.find({
            owner: curUserId
        }).populate('likes');
        // as we have given ref as user in posts likes .. so it will populate the enetire user by the reference
        // likes k array k andar jis jis ka owner ka id hoga unn sabh ka hame mil jayega entire user

        return res.send(success(200, { allUserPosts }))
    } catch (e) {
        console.log(e);
        return res.send(error(500, e.message));
    }

}


const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.send(error(400, "userId is  required"));
        }

        const allUserPosts = await Posts.find({
            owner: userId
        }).populate('likes');
        // as we have given ref as user in posts likes .. so it will populate the enetire user by the reference
        // likes k array k andar jis jis ka owner ka id hoga unn sabh ka hame mil jayega entire user

        return res.send(success(200, { allUserPosts }))
    } catch (e) {
        console.log(e);
        return res.send(error(500, e.message));
    }
}

const deleteMyProfile = async (req, res) => {

    try {
        const curUserId = req._id;
        
        const curUser = await User.findById(curUserId);

        // delete all posts
        await Posts.deleteMany({
            owner: curUserId
        });

        // removed myself from follower's followings
        curUser.followers.forEach(async (followerId) => {
            const follower = await User.findById(followerId);
            const index = follower.followings.indexOf(curUserId);
            follower.followings.splice(index, 1);
            await follower.save();
        });

        // removed myself from following's  follower
        curUser.followings.forEach(async (followingId) => {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(curUserId);
            following.followers.splice(index, 1);
            await following.save();
        });


        // remove myself from all likes
        const allPosts = await Posts.find();
        allPosts.forEach(async (post) => {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);
            await post.save();
        });

        await curUser.remove();

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        });

        return res.send(success(200, "user deleted"));

    } catch (e) {
        console.log(e);
        return res.send(error(500, e.message));
    }

}

const getMyInfo = async (req, res) => {
    try {
        const user = await User.findById(req._id);
        return res.send(success(200, { user }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}


const updateUserProfile = async (req, res) => {
    try {
        const { name, bio, userImg } = req.body;

        const user = await User.findById(req._id);

        if (name) {
            user.name = name;
        }
        if (bio) {
            user.bio = bio;
        }
        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: 'profileImg'
            });
            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id
            }
        }
        await user.save();
        return res.send(success(200, { user }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate({
            path: "posts",
            populate: {
                path: "owner",
            },
        });

        const fullPosts = user.posts;
        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        return res.send(success(200, { ...user._doc, posts }));
    } catch (e) {
        console.log('error put', e);
        return res.send(error(500, e.message));
    }
};

module.exports = {
    followOrUnfollowUserController,
    getFeedData,
    getMyPosts,
    getUserPosts,
    deleteMyProfile,
    getMyInfo,
    updateUserProfile,
    getUserProfile
}