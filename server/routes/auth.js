import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();    // This piece of code allow express to identify that these routes will
                                    // all be configured and allows us to have these in separate files to keep us organized.

router.post("/login", login);       // We are not using aap.post here instead we used router.post

export default router;