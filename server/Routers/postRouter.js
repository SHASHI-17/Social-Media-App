const router=require('express').Router();
const {getAllPostsControllers ,createPostController,likeUnlikePost,updatePostController,deletePostController}=require("../Controllers/postController");
const requireUser=require('../middleware/requireUser');

router.get('/all',requireUser,getAllPostsControllers);
router.post('/',requireUser,createPostController);
router.post('/like',requireUser,likeUnlikePost);
router.put('/',requireUser,updatePostController);
router.delete('/',requireUser,deletePostController);




module.exports=router;


