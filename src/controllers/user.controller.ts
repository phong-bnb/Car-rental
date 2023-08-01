import { User } from "../schemas/user.schema";
import { RentalDetail } from "../schemas/rentaldetail.schema";

class UserController {
  static async displayUserPage(req: any, res: any) {
    if (req.user) {
      const user = req.user;
      const rentalBill = await RentalDetail.find({
        user_id: req.user.id,
      })
        .populate("user_id")
        .populate("car_id");
      res.render("userdetail", { user: user, data: rentalBill });
    } else {
      res.redirect("/index");
    }
  }

  static async displayUserEditPage(req: any, res: any) {
    if (req.user) {
      const user = req.user;
      const userInfo = await User.findOne({ _id: user.id });
      res.render("useredit", { user: user, userData: userInfo });
    } else {
      res.redirect("/index");
    }
  }

  static async removeBill(req: any, res: any) {
    const billId = req.params.id;
    const bill = await RentalDetail.findByIdAndDelete({ _id: billId });
    res.redirect("/user");
  }

  static async updateUserInfo(req: any, res: any) {
    if (req.user) {
      const userId = req.user.id;
      const user = await User.findOne({ _id: userId });
      const data = {
        user_name: req.body.name,
        user_email: req.body.email,
        user_password: req.body.password,
      };
      await user.updateOne(data);
      res.redirect("/user");
    } else {
      res.redirect("/index");
    }
  }
}

export default UserController;