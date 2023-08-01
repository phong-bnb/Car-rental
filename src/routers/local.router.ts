import {Router} from "express";
import multer from "multer";
const upload = multer();
import express from "express";
import LocalController from "../controllers/local.controller";
import permissionMiddleware from "../middlewares/permission.middleware";
const localRouter = Router();

localRouter.use(permissionMiddleware)

localRouter.get('/createlocals',upload.none(),LocalController.getCreateLocal);
localRouter.post('/createlocals',upload.none(),LocalController.createLocals);
localRouter.get('/listlocals',upload.none(),LocalController.getListLocal);
localRouter.get('/:id/delete',upload.none(),LocalController.deleteLocal);
localRouter.get('/update/:id',upload.none(),LocalController.getUpdateLocal);
localRouter.post('/update/:id',upload.none(),LocalController.updateLocal)

export default localRouter