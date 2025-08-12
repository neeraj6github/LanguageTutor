import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true },
  
 password: {
  type: String,
  required: function () {
    return this.signupType === 'manual';
  },
},
signupType: {
  type: String,
  required: true,
  enum: ['manual', 'google'],
},

});


const User = mongoose.model("User", userSchema);
export default User;