import mongoose from "mongoose";

const userSchema = mongoose.Schema({
   name: {
     type: String, 
     required: true 
    },
   
  email: 
  { 
    type: String,
     required: true, unique: true 
    },
  phone: 
  { 
    type: Number
},
 role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },

  password:
   {
     type: String, required: true 
    },
    token:{
      type:String,
      default:null,
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
