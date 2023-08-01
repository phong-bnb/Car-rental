import express from "express";
import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

import { Router } from "express";
import CarController from "../controllers/cars.controller";
import carsController from "../controllers/cars.controller";
import permissionMiddleware from "../middlewares/permission.middleware";
const carRouter = Router();


carRouter.get("/cars/list", CarController.showAllCar);
carRouter.get("/cars/detail/:id", CarController.carDetail);
carRouter.post("/cars/detail/:id", CarController.carComment);
carRouter.get("/cars/list", CarController.showAllCar);
carRouter.post("/cars/list",upload.none(), CarController.showAllCar);
carRouter.get("/cars/detail/:id", CarController.carDetail);

carRouter.use(permissionMiddleware);

carRouter.get("/adm/createcar", CarController.showCreateForm);
carRouter.post(
  "/adm/createcar",
  upload.array("img", 10),
  CarController.createCar
);
carRouter.get('/adm/updatecar/:id',CarController.getUpdate);
carRouter.post('/adm/updatecar/:id',upload.array("img",10), CarController.updateCar);
carRouter.get("/adm/list",CarController.showCarForAdm)
carRouter.post("/adm/list",upload.none(),CarController.showCarForAdm)
carRouter.get('/adm/delete/:id',CarController.deleteCar)
carRouter.get("/adm/updatecar/:id", CarController.getUpdate);
carRouter.post(
  "/adm/updatecar/:id",
  upload.array("img", 10),
  CarController.updateCar
);
// carRouter.get("/adm/list", CarController.showAllCarForAdm);
carRouter.get("/adm/delete/:id", CarController.deleteCar);
export default carRouter;