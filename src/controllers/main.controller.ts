import {User} from "../schemas/user.schema";

export class MainController {
  static async showHomePage(req: any, res: any) {
    let role;
    let user;
    if (req.user) {
      if (req.user.username) {
        user = req.user;
        role = req.user.role;
      } else {
        let userInfo = await User.findOne({ _id: req.user.id });
        user = {
          id: userInfo._id,
          username: userInfo.user_name,
          role: userInfo.user_role,
        };
        role = userInfo.user_role;
      }
    }
    res.render("index", { userState: role, userGreet: user });
  }

  static getInfoUser(req, res) {
    let role;
    let user;
    if (req.user) {
      user = req.user;
      role = req.user.role;
    }
    return user.username;
  }
}