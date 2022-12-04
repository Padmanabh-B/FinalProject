import User from "../models/user.schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import mailHelper from "../utils/mailHelper"
import crypto from "crypto"

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly:true,
    //could be in a separe file in utils
}

/*********************************
* @SIGNUP 
* @route http://localhost:4000/api/auth/signup
* @description User signup controller for creating a new user
* @parameters name, email, password
* @return User Object
*********************************/

export const signUp = asyncHandler(async (req,res)=>{
    const {name, email, password} = req.body

    if(!name || !email || !password){
        throw new CustomError('Please Fill all Fields ', 400)
    }

    //check if user exists
    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new CustomError('User Already Exists', 400)
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const token = user.getJwtToken() 
    console.log(user);
    user.password = undefined;

    res.cookie("token", token, cookieOptions)
    
    res.status(200).json({
        success:true,
        token,
        user
    })

})

/*********************************
* @Login 
* @route http://localhost:4000/api/auth/login
* @description User login controller for creating a new user
* @parameters email, password
* @return User Object
*********************************/

export const login = asyncHandler(async (req,res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new CustomError('Please Fill all Fields ', 400)
    }

    const user = User.findOne({email}).select("+password")

    if(!user){
        throw new CustomError('Invalid Credentials ', 400)
    }

    const isPasswordmatched = await user.comparePassword(password);

    if(isPasswordmatched){
        const token  = user.getJwtToken()
        user.password = undefined;
        res.cookie("token", token ,cookieOptions)
        return res.status(200).json({
            success:true,
            token,
            user
        })
    }
    throw new CustomError('Invalid Credentials - pass', 400)

});



/*********************************
* @Logout 
* @route http://localhost:4000/api/auth/logout
* @description User logout by clearing user cookies
* @parameters None
* @return Success Message
*********************************/

export const logout = asyncHandler(async(_req,res)=>{
    //res.clearCookie
    res.cookie("token", null, {
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        messege:"Logged Out"
    })
})




/*********************************
* @Forgot_Password 
* @route http://localhost:4000/api/auth/password/forgot
* @description User will submit email & we will generate a token
* @parameters email
* @return Success Message - email sent
*********************************/


export const forgotPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    //check email validation for null for empty
    const user = await User.findOne({email})

    if(!user){
        throw CustomError("User Not Found", 404)
    }

    const resetToken = user.generateForgotPasswordToken()
    await user.save({validateBeforeSave : false});

    const resetUrl = 
    `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`

    const text = `Your Password reset link is 
    \n\n ${resetUrl} \n\n`

    try {
        await mailHelper({
            email:user.email,
            subject:"Password Reset Email for website",
            text:text,
        });
        res.status(200).json({
            success:true,
            message:`Email send to ${user.email}`
        })
    } catch (error) {
        //roll back - clear fields and save
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save({validateBeforeSave:false})


        throw CustomError(error.message || "Failure to sent Email", 500)
        
    }


})


/*********************************
* @Reset_Password 
* @route http://localhost:4000/api/auth/password/reset/:resetToken
* @description User will able to reset based on url token
* @parameters token from url , password and confirm password
* @return User object
*********************************/

export const resetPassword = asyncHandler(async(req,res)=>{
    const {token: resetToken} = req.params;
    const {password, confimPassword} = req.body

    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}
    })

    if(!user){
        throw new CustomError("Password token is Invalid or invalid ", 400)
    }
    if(password !== confimPassword){
        throw new CustomError("Password and Confirm Password does not match ", 400)

    }

    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    //create a token and send it to user
    const token = user.getJwtToken()
    user.password= undefined

    //helper method for cookie can be added
    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success:true, 
        user,
    })

})


// TODO: Create a controller for change password



/*********************************
* @GET_PROFILE
* @REQUEST_TYPE GET
* @route http://localhost:4000/api/auth/profile
* @description check for tke and populate req.user
* @parameters name, email and password
* @return User object
*********************************/

export const getProfile = asyncHandler(async(req,res, next)=>{
    const {user} = req;
    if(!user){
        throw new CustomError("User not Found", 404)
    }
    res.status(200).json({
        success:true,
        user
    })

})