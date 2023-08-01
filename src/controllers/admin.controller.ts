import { User } from "../schemas/user.schema";
import { Car } from "../schemas/car.schema";

class AdminController {
  static async displayAdminEditPage(req: any, res: any) {
    if (req.user) {
      const user = req.user;
      const adminInfo = await User.findOne({ _id: user.id });
      res.render("admin/adminEdit", { user: user, userData: adminInfo });
    } else {
      res.redirect("/index");
    }
  }

  static async updateAdminInfo(req: any, res: any) {
    if (req.user) {
      const userId = req.user.id;
      const user = await User.findOne({ _id: userId });
      const data = {
        user_name: req.body.name,
        user_email: req.body.email,
        user_password: req.body.password,
      };
      await user.updateOne(data);
      res.redirect("/admin/admininfo");
    } else {
      res.redirect("/index");
    }
  }

  static async deleteComment(req: any, res: any) {
    const commentId = req.params.id;
    const comment = await Car.findOne({
      "car_comment._id": commentId,
    });
    await comment.updateOne({ $pull: { car_comment: { _id: commentId } } });
    res.redirect(req.headers.referer);
  }
}

export default AdminController;