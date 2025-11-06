const UserRepository = require('../repository/UserRepository');
const PetRepository = require('../repository/PetRepository');
const VetRepository = require('../repository/VetRepository');
const LocationRepository = require('../repository/LocationRepository');
const authController = require('../middleware/AuthController');
const cloudinary = require("../utils/cloudinary");

const bcrypt = require('bcrypt');


class UserController {
    #userRepository;
    #petRepository;
    #vetRepository;
    #locationRepository;
    #otpController;
    #authController;

    constructor(otpController) {
        this.#otpController = otpController;
        this.#userRepository = new UserRepository();
        this.#petRepository = new PetRepository();
        this.#vetRepository = new VetRepository();
        this.#locationRepository = new LocationRepository();
        this.#authController = authController;

        this.getUserLocation = this.getUserLocation.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.saveValidatedUser = this.saveValidatedUser.bind(this);
        this.savePet = this.savePet.bind(this);
        this.register = this.register.bind(this);
        this.validateOTP = this.validateOTP.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.updateUserDetails = this.updateUserDetails.bind(this);
        this.updateUserLocation = this.updateUserLocation.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
    }

    async updateUserDetails(req, res) {
        try {
            const user = req.body.data ? JSON.parse(req.body.data) : req.body;

            console.log("Updating user:", user);

            if (req.file) {
                // stream the buffer into Cloudinary
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "profile-pictures",
                        resource_type: "image",
                        allowed_formats: ["jpg", "jpeg", "png", "webp"],
                    },
                    (error, result) => (error ? reject(error) : resolve(result))
                    );
                    // Multer memory buffer -> upload_stream
                    stream.end(req.file.buffer);
                });

                console.log("uploadResult",uploadResult);

                user.profilePicture = uploadResult.secure_url;
            }

            console.log("Updating user profile picture:", user);
            const updatedUser = await this.#userRepository.update(user.id, user);
            res.status(200).json({ok: true, message: 'User details updated successfully', data: updatedUser });
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error updating user details', error: error.message });
        }
    }

    async updateUserLocation(req, res) {
        try {
            const { userId, location } = req.body;
            console.log("Updating location for user:", userId, location);
            const existingLocation = await this.#locationRepository.findLocationByUserId(userId);
            if(existingLocation){
                const updatedLocation = await this.#locationRepository.update(existingLocation.id, location);
                res.status(200).json({ok: true, message: 'User location updated successfully', data: updatedLocation });
            }else{
                const newLocation = await this.#locationRepository.create({...location, userId});
                res.status(200).json({ok: true, message: 'User location created successfully', data: newLocation });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error updating user location', error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            console.log('Authenticated user:', req.user);
            const users = await this.#userRepository.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }

    async getUserLocation(req,res) {
        try {
            const { userId } = req.params;
            // console.log("userId",userId);
            const location = await this.#locationRepository.findLocationByUserId(userId);
            res.status(200).json({ok: true, message: "User Location found", data:location});
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error fetching user location', error: error.message });
        }
    }

    // Method to handle GET /api/users/:id
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await this.#userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ok:false ,message: 'User not found' });
            }
            res.status(200).json({ok: true, data:user, message: "User found"});
        } catch (error) {
            res.status(500).json({ok:false, message: 'Error fetching user', error: error.message });
        }
    }

    async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await this.#userRepository.findByEmail(email);
            if (!user) {
                return res.status(205).json({ message: 'User not found' });
            }
            res.status(200).json({message: "User found", data:user});
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    }

    async register(req, res) {
        try {
            const user = req.body.data ? JSON.parse(req.body.data) : req.body;

            if (req.file) {
                // stream the buffer into Cloudinary
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "my-app",
                        resource_type: "image",
                        allowed_formats: ["jpg", "jpeg", "png", "webp"],
                    },
                    (error, result) => (error ? reject(error) : resolve(result))
                    );
                    // Multer memory buffer -> upload_stream
                    stream.end(req.file.buffer);
                });

                console.log("uploadResult",uploadResult);

                user.vetInfo.uploadCertificate = uploadResult.secure_url;
            }

            user.userInfo.password = await bcrypt.hash(user.userInfo.password, 10);
            console.log("--- Requesting OTP ---", user);
            await this.#otpController.generateAndSend(user);
            console.log("Check your email (or Mailtrap inbox) for the OTP.");
            res.status(200).json({ok: true, message: 'OTP sent successfully' });
        } catch (error) {
            res.status(500).json({ok: false, message: 'Error Register', error: error.message });
        }
    }

    async resendOTP(req, res) {
        try {
            const {email} = req.body;
            const result = await this.#otpController.resendOTP(email)
            if(result.success){
                res.status(200).json({ ok: true, message: 'OTP Resent successfully' });
            }else{
                console.log(result);
                res.status(400).json({ ok: false, message: 'Failed to resend OTP' });
            }
        } catch (error) {
            res.status(400).json({ ok: false, message: 'Invalid OTP' });
        }
    }

    async forgotPassword(req, res) {
        try {
            const {email} = req.body;
            const result = await this.#otpController.generateAndSendForgotPassword(email)
            if(result){
                res.status(200).json({ ok: true, message: 'Forgot Password Email sent successfully' });
            }else{
                console.log(result);
                res.status(400).json({ ok: false, message: 'Failed to sent Forgot Password Email' });
            }
        } catch (error) {
            res.status(400).json({ ok: false, message: 'Invalid email' });
        }
    }
    
    async validateOTP(req, res) {
        try {
            const {email, otp} = req.body;
            const result =await this.#otpController.verify(email, otp);
            if(result.success){
                console.log("result ",result);
                const insertedUser = await this.saveValidatedUser(result.data.userInfo);
                console.log("insertedUser",insertedUser);
                if(result.data.userInfo.role === 'vet'){
                    const vet = await this.saveVet({...result.data.vetInfo, userId: insertedUser.id});
                    console.log(vet);
                }else if(result.data.userInfo.role === 'user'){
                    const pet =await this.savePet({...result.data.petInfo, petDob: new Date(result.data.petInfo.petDob), userId: insertedUser.id});
                    console.log(pet);                    
                }
                res.status(200).json({ ok: true, message: 'OTP Verified successfully', data: insertedUser });
            }else{
                res.status(400).json({ ok: false, message: 'Invalid OTP' });
            }
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error Validate OTP', error: error.message });
        }
    }
    
    async savePet(payload){
        try {
            const newPet = await this.#petRepository.create(payload);
            return newPet;
        } catch (error) {
            return error.message;
        }
    }

    async saveVet(payload){
        try {
            const newVet = await this.#vetRepository.create(payload);
            return newVet;
        } catch (error) {
            return error.message;
        }
    }
    
    // Method to handle POST /api/users
    async saveValidatedUser(payload) {
        try {
            console.log("ini payload",payload);
            // console.log(req.body);
            const prefix = payload.role === 'vet' ? 'V' : payload.role === 'admin'? 'A' : 'U';
            const lastIdDigit = await this.#userRepository.findLastId(prefix);
            const newId = `${prefix}${String(lastIdDigit+1).padStart(3, '0')}`;
            const user = {
                id: newId,
                email: payload.email,
                password: payload.password,
                firstName: payload.firstName,
                lastName: payload.lastName,
                phoneNumber: payload.phoneNumber,
                profilePicture: payload.profilePicture,
                fullName: payload.fullName,
            }
            console.log(payload.location);
            const newUser = await this.#userRepository.create(user);
            await this.#locationRepository.create({...payload.location, userId: newId});
            console.log(newUser)
            return newUser;
        } catch (error) {
            return error.message;
        }
    }

    async validateLogin(req, res) {
        try {
            const user = await this.#userRepository.findByEmail(req.body.email);
            console.log(user);
            if(user){
                // console.log(await bcrypt.compare(req.body.password, user.password));
                if(await bcrypt.compare(req.body.password, user.password)){
                    const role = user.id.startsWith('V') ? 'vet' : user.id.startsWith('A') ? 'admin' : 'user';
                    const accessToken = this.#authController.generateAccessToken(user.id, user.email, role);
                    const refreshToken = this.#authController.generateRefreshToken(user.id, user.email, role, req.body.rememberMe);
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        maxAge: req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30d vs 1d
                    });
                    console.log(accessToken, refreshToken);
                    
                    res.status(200).json({ok: true, message: 'Login successful', data: {fullName: `${user.firstName} ${user.lastName}`, id: user.id, email: user.email, role: role}, accessToken: accessToken});
                }else{
                    throw new Error('Invalid Password');
                }
            }else{
                throw new Error('User not found');
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error Login', error: error.message });
        }
    }
}


module.exports = UserController;