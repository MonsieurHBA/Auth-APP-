// hne n7ot type mtaa routes eli houma request 


const { Router } = require('express') ;
const router = Router() ;
// tawa bech nimporty eli AuthController eli 3mlat fyh les function besh n3aytelhom fi blayeshom
const AuthController = require('../controller/AuthController') ;

router.get('/signup' , AuthController.signup_get ) ;
router.post('/signup' , AuthController.signup_post);
router.get('/login' , AuthController.login_get);
router.post('/login' , AuthController.login_post);
router.get('/logout' , AuthController.logout_get);
module.exports = router ;