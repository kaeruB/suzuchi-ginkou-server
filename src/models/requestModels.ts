import {Request} from "express";
import {User} from "./userModel";

export interface RequestWithSession extends Request {
    session?: {
        user: User,
        // destroy: () => void
    }
}