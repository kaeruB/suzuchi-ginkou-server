import mongoose from "mongoose"
import {Pair} from "../utils/typescript/interfaces";

const pairSchema = new mongoose.Schema<Pair>({
  pairId: {
    type: String,
    required: true,
    unique: false
  },
  userId: {
    type: String,
    required: true
  }
})

const PairModel = mongoose.model("Pair", pairSchema)
module.exports = PairModel;