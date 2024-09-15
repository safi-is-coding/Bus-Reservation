const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?ga=GA1.1.74446056.1726165125&semt=ais_hybrid"
    },
    name: String,
    email: { 
        type: String, 
        unique: true 
    },
    password: String,
    isAdmin: { type: Boolean, default: false }
});
module.exports = mongoose.model('User', UserSchema);
