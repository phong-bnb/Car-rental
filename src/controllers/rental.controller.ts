import express from "express";
import multer from "multer";
import { Car } from "../schemas/car.schema";
import { DropofLocaltion } from "../schemas/dropoflocaltion.schema";
import { RentalDetail } from "../schemas/rentaldetail.schema";
import { PickupLocaltion } from "../schemas/pickuplocaltion.schema";
import { User } from "../schemas/user.schema";
const stripe = require('stripe')('sk_test_51NVsLnHt7JaGigtxugiIQz6qLxhNpt7pu4tWSPgbwItO3gHLDCSKxE0PaY3RMh2SZ3gmWT8G46nWC9vrwHgs6eKZ00gqpGP69A');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

class RentalControllers {
  static async getFormBookCar(req: any, res: any) {
    try {
      const dataCar = await Car.findOne({ _id: req.params.id }).populate([{
        path: "pickup",
        select: "pickupLocaltion_name",
      },{ path: "drop",
        select: "dropofLocaltion_name",}]);
      let role;
      let user;
      if (req.user) {
        if (req.user.username) {
          user = req.user;
          role = req.user.role;
        } else {
          let userInfo: any = await User.findOne({ _id: req.user.id });
          user = {
            id: userInfo._id,
            username: userInfo.user_name,
            role: userInfo.user_role,
          };
          role = userInfo.user_role;
        }
      }
      const rentalDetail = await RentalDetail.find({ car_id: dataCar.id });
      res.render("bookingCar", {
        car: dataCar,
        pickLocations: dataCar.pickup,
        dropLocations: dataCar.drop,
        userState: role,
        userGreet: user,
        rentalDetail: rentalDetail,
      });
    } catch (err) {
      res.render("notfound");
    }
  }

  static async bookOrderDetail(req: any, res: any) {
    try {
      let { nameCarSelect, dropofLocation, datePickup, dateDropof } = req.body;
      const pickupDate: any = new Date(datePickup);
      const dropoffDate: any = new Date(dateDropof);
      const dataCar = await Car.findOne({ _id: req.params.id }).populate({
        path: "pickup",
        select: "pickupLocaltion_name",
      });
      // @ts-ignore
      const numberOfDays: number = Math.ceil(
        (dropoffDate - pickupDate ) / (1000 * 60 * 60 * 24)
      );
      let totalCost = numberOfDays * dataCar.car_rentalPrice;
      const dataPickupLocation = await PickupLocaltion.findOne({
        _id: dataCar.pickup._id,
      });
      const dataDropLocation = await DropofLocaltion.findOne({
        _id: dataCar.drop._id,
      });
      let newRentalDetail = await new RentalDetail({
        car_id: dataCar._id,
        user_id: req.user.id,
        datePickup: datePickup,
        dateDrop: dateDropof,
        total_cost: totalCost,
      });
      dataCar.car_availability = "unavailable";
      dataCar.car_model = nameCarSelect;
      dataDropLocation.dropofLocaltion_name = dropofLocation;
      const p1 = dataCar.save();
      const p2 = dataDropLocation.save();
      const p3 = dataPickupLocation.save();
      const p4 = newRentalDetail.save();
      let [dataCars, dataDropLocations, dataPickupLocations, rentalDetail] =
        await Promise.all([p1, p2, p3, p4]);
      res.render("bookingOrderDetail", {
        car: dataCars,
        pickupLocation: dataPickupLocations,
        dropLocation: dataDropLocations,
        rentalDetail: newRentalDetail,
        idBooking : newRentalDetail._id,
      });
    } catch (err) {
      res.render("notfound");
    }
  }

  static async cancelBill(req: any, res: any) {
    const billId = req.params.id;
    const bill = await RentalDetail.findByIdAndDelete({ _id: billId });
    res.redirect('/cars/list');
  }
  static async payment(req: any, res: any){
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1NVtCIHt7JaGigtxzd2c1gBF',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3333/car/success`,
        cancel_url: `http://localhost:3333/cars/list`,

      })
      res.redirect(session.url);
    } catch (e){
      console.log(e.message)
    }
  }

  static async showSuccess(req:any, res:any){
    res.render("success")
  }
  static async showErorr(req:any, res:any){
    res.render("cancel")
  }

}


export default RentalControllers;