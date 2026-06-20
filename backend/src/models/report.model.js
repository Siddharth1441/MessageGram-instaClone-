const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    reporter:{ type:mongoose.Schema.Types.ObjectId, ref:"users", required:true },
    targetType:{ type:String, enum:["post","comment","user"], required:true },
    targetId:{ type:mongoose.Schema.Types.ObjectId, required:true },
    reason:{ type:String, required:true, trim:true, maxlength:120 },
    details:{ type:String, trim:true, maxlength:1000, default:"" },
    status:{ type:String, enum:["open","reviewing","resolved","dismissed"], default:"open" }
},{
    timestamps:true
})

reportSchema.index({ status:1, createdAt:-1 })

module.exports = mongoose.model("reports", reportSchema)
