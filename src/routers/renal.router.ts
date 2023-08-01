import {Router} from "express";
import RentalControllers from "../controllers/rental.controllers";

export const rentalRouters = Router();
rentalRouters.get("/booking/:id", RentalControllers.getFormBookCar)
rentalRouters.post("/booking/:id", RentalControllers.bookOrderDetail)
rentalRouters.get("/booking/delete/:id", RentalControllers.cancelBill)
rentalRouters.post("/create-checkout-session", RentalControllers.payment)
rentalRouters.get("/success", RentalControllers.showSuccess)
rentalRouters.get("/cancel", RentalControllers.showErorr)