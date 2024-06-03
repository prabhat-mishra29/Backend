import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who is subscribing [mujhe kisne subscribe kiya hai]
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing [maine kisko subscribe kiya hai]
        ref: "User"
    }
}, {timestamps: true})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)

// In mongoDB "Subscription" saves as "subscriptions".