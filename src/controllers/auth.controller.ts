import {User} from "../schemas/user.schema";
import userController from "./user.controller";

class AuthController {
    static getFormLogin(req: any, res: any): any {
        if (req.isAuthenticated()) {
        return res.redirect('/index') 
        }
        let failureMessage = req.session.messages ;
        res.render('auth/login',{failureMessage:failureMessage})
    }

    static getFormRegister(req: any, res: any): any {
        res.render('auth/register', { alertUsernameExisted: false })
    }

    static async register(req: any, res: any) {
        let { name, email, password } = req.body;
        const userNameExists = await User.findOne({ user_email :email  });
        if (userNameExists)  return res.render('auth/register', { alertUsernameExisted: true });
        let user = new User({
            user_name: name,
            user_email: email,
            user_password: password,
            user_role: 'user'
        });
        await user.save();
        res.redirect('/login')
    };

    static async getInfoUser(req,res){
        const user = await User.find({user_role:'user'});
        if (user)
        res.render('admin/adminListUser', {users: user})
    }

    static async deleteUser(req,res){
        try {
            const user = await User.findOne({_id : req.params.id})
            if (user){
                await user.deleteOne({_id : req.params.id})
                res.redirect('/admin/listuser')
            }else {
                res.render('notfound')
            }
        }catch (e){
            res.render('notfound')
        }
    }
}
export default AuthController;