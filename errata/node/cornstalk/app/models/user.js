//app/models/user


var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    id:Number,
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    isAdmin: Boolean,
    isActivated: Boolean,
    lastLogIn: Date
});
var MarkersSchema = new Schema ({
    userId: Number,
    ImageId: Number,
    MarkerPos:{
        stalkNum: Number,
        coordinates: Array
    },
    user:[
        {type: Schema.Types.ObjectId, ref: 'User'}
    ]
});
var ImageSchema  = new Schema({
   id:Number,
    path: String,
    thumbnailPath: String,
    user:[
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    image: { data: Buffer, contentType: String },
    markers: [
    {type: Schema.Types.ObjectId, ref: 'Markers'}
    ]
});

module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('User', ImageSchema);
module.exports = mongoose.model('User', MarkersSchema);