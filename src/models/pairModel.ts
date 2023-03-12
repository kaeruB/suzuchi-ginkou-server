import mongoose from "mongoose"
import {Pair} from "../utils/typescript/interfaces";

const pairSchema = new mongoose.Schema<Pair>({
  pairId: {
    type: String,
    required: true,
    unique: false
  },
  userEmail: {
    type: String,
    required: true
  }
})

export const PairModel = mongoose.model("Pair", pairSchema)
