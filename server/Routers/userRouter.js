const router = require('express').Router();
const requireUser = require('../middleware/requireUser');
const { followOrUnfollowUserController, getFeedData, getMyPosts, getUserPosts, deleteMyProfile,
             getMyInfo,updateUserProfile ,getUserProfile   } = require('../Controllers/userController')

router.post('/follow', requireUser, followOrUnfollowUserController);
router.get('/getFeedData', requireUser, getFeedData);
router.get('/getMyPosts', requireUser, getMyPosts);
router.get('/getUserPosts', requireUser, getUserPosts);
router.delete('/', requireUser, deleteMyProfile);
router.get('/getMyInfo', requireUser, getMyInfo); 

router.put('/',requireUser,updateUserProfile);
router.post('/getUserProfile',requireUser,getUserProfile);

module.exports = router;