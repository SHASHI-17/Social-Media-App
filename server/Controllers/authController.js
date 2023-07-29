const User=require('../Modals/User');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {error, success}=require('../utils/responseWrapper')

const signupController = async (req, res) => {
    try {

        const {name, email ,password }=req.body;

        if(!email || !password || !name){
            // return res.status(400).send("All fields are required !");
            return res.send(error(400,"All fields are required !"));
        }

        const oldUser=await User.findOne({email});

        if(oldUser){
            return res.send(error(409,"User is already registerd"));
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({  // it is equivalent to new User({...}) then user.save()
            name, 
            email,
            password:hashedPassword
        });


        // return res.status(201).json({
        //     user
        // })

        // const newUser= await User.findById(user._id);
        return res.send(success(201,"User Created Successfully"));

    } catch (e) {
        return res.send(error(500,e.message));
    }
};

const loginController = async (req, res) => {
    try {

        const { email ,password }=req.body;

        if(!email || !password){
            return res.send(error(400,"All fields are required !"));
        }

        const user=await User.findOne({email}).select('+password');

        if(!user){
           return res.send(error(404,"User is not registered"));
        }

        const matched=await bcrypt.compare(password,user.password);

        if(!matched){
            return res.send(error(403,"password incorrect  not found"));
        }

        const accessToken=genrateAccessToken({_id:user._id});
        const refreshToken=genrateRefreshToken({_id:user._id});

         res.cookie('jwt',refreshToken,{    //front end cant access  it anymore if httponly is true
                                            // backend had now setted up the cookie for frontend
            httpOnly:true,
            secure:true
         });

        // return res.status(200).json({
        // //    user,
        //    accessToken
        // })
        return res.send(success(200,{
            accessToken
        }));

    } catch (e) {
        return res.send(error(500,e.message));   
    }
};


        const   logoutController=async (req,res)=>{
                    try {
                        res.clearCookie('jwt',{
                            httpOnly:true,
                            secure:true
                        });

                        return res.send(success(200,"User logged out"))
                    } catch (e) {
                        return res.send(error(500,e.message));
                    }
        }


    // will check the refresh token validity and generate a new access token
    const refreshAccessTokenController=async(req,res)=>{
        // const {refreshToken} =req.body;
        const cookies= req.cookies;
        if(!cookies.jwt){
            return res.send(error(401,"Refresh token in cookie is required"));
        }

        const refreshToken=cookies.jwt;  

        // if(!refreshToken){
        //         return res.status(401).send("Refresh token is required");
        // }
        console.log("refresh ",refreshToken);
        try{
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_P_KEY);     

                const _id =decoded._id;

                const accessToken=genrateAccessToken({_id});

                // return res.status(201).json({accessToken});
                return res.send(success(201,{
                    accessToken
                }));
                
        } catch(e){
                console.log(e);
                res.send(error(401,"Invalid Refresh token or expired"));
        }

    }

// internal functions 
const genrateAccessToken = (data)=>{
    const token= jwt.sign(data,process.env.ACCESS_TOKEN_P_KEY,{
        expiresIn:'1d'
    });
   console.log(token);
   return token;
}
const genrateRefreshToken = (data)=>{
    const token= jwt.sign(data,process.env.REFRESH_TOKEN_P_KEY,{
        expiresIn:'1y'
    });
   console.log(token);
   return token;
}

module.exports = { signupController, loginController,refreshAccessTokenController ,logoutController };