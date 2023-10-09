import { Router } from "express"
import passport from "passport"
import sessionsController from "../controllers/sessions.controller.js"


const router = Router()

router.post("/register", passport.authenticate("register", {passReqToCallback: true, session: false, failureMessage: true}), sessionsController.register)
router.post("/login", passport.authenticate("login", {passReqToCallback: true, session: false}), sessionsController.login)
router.post("/logout", sessionsController.logout)

router.post("/resetPasswordEmail", sessionsController.resetPasswordEmail)
router.post("/resetPassword", sessionsController.resetPassword)


// router.get("/github", passport.authenticate("github", {scope: ["user: email"]})),async (req, res) => {
//     res.status(HTTP_STATUS.OK).send("Usuario logueado con GitHub")
// }

// router.get("/githubCallback", passport.authenticate("github", {failureRedirect: "/login"})),async (req, res) => {
//     req.session.user = req.user
//     res.redirect("/products")
// }




export default router