const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   name:{
       type:String,
       required:true,
       trim:true
   },
   lastname:{
       type:String,
       required:true,
       trim:true
   },
   email:{
       type:String,
       required:true, 
       unique:true,
       lowercase:true,
       trim:true
   },
   password:{
       type:String,
       required: true,
       trim:true
   },
   date:{
       type:Date,
       default:Date.now()
   }
})

module.exports = mongoose.model('User', userSchema);

// TODO: mongoose.model('Nombre Collection', modelo);

/* 
 TODO: siempre poner el nombre de la collection en singular, por ejemplo "user".
 mongo automaticamente lo pone en plural como "users".
 */
