import {DropofLocaltion} from "../schemas/dropoflocaltion.schema";
import { PickupLocaltion} from "../schemas/pickuplocaltion.schema";
import {Car} from "../schemas/car.schema";

class LocalController {
    static async createLocals(req,res){
        try {
            let dropLocal =await DropofLocaltion.findOne({dropofLocaltion_name:req.body.dropOf})
            let pickLocal =await PickupLocaltion.findOne({pickupLocaltion_name:req.body.pickUp})
            if (!dropLocal && !pickLocal){
                const dropLocalNew = new DropofLocaltion({
                    dropofLocaltion_name : req.body.dropOf,
                });
                const pickLocalNew = new PickupLocaltion({
                    pickupLocaltion_name :  req.body.pickUp,
                });
                await pickLocalNew.save();
                await dropLocalNew.save();
                res.redirect('/adm/listlocals')
            }else {
                res.render('notfound')
            }
        }catch (e){
            res.render('notfound')
        }
    }

    static async getCreateLocal(req,res){
        await res.render('admin/admaddlocals')
    }

    static async getListLocal(req,res){
        try {
            const dropLocal = await DropofLocaltion.find();
            const pickLocal = await PickupLocaltion.find();
            let limit : number;
            let currentPage = req.query.page ? +req.query.page : 1;
            if (!req.query.limit){
                limit = 3;
            }else {
                limit = parseInt(req.query.limit);
            }
            let totalPagesDrop = Math.ceil(dropLocal.length/limit)
            let totalPagesPick = Math.ceil(pickLocal.length/limit)
            let offset = (currentPage - 1) * limit
            const dropLocals = await DropofLocaltion.find().limit(limit).skip(offset)
            const pickLocals = await PickupLocaltion.find().limit(limit).skip(offset)
            res.render("admin/listlocals",{dropLocal:dropLocals,pickLocal:pickLocals,totalPagesDrop:totalPagesDrop,totalPagesPick:totalPagesPick,currentPage:currentPage})
        }catch (e){
            res.render('notfound')
        }
    }

    static async deleteLocal(req,res){
        try {
            const dropLocal = await DropofLocaltion.findOne({_id : req.params.id})
            const pickLocal = await PickupLocaltion.findOne({_id : req.params.id})
            if (dropLocal){
                await dropLocal.deleteOne({_id : req.params.id})
                res.redirect('/adm/listlocals')
            }else if (pickLocal) {
                await pickLocal.deleteOne({_id : req.params.id})
                res.redirect('/adm/listlocals')
            }else {
                res.render('notfound')
            }
        }catch (e){
            res.render('notfound')
        }
    }

    static async getUpdateLocal(req,res){
        try {
            const dropLocal = await DropofLocaltion.findOne({_id: req.params.id})
            const pickLocal = await PickupLocaltion.findOne({_id: req.params.id})
            if (dropLocal){
                res.render('admin/updateLocal',{local:dropLocal, name:'drop'})
            }else if(pickLocal) {
                res.render('admin/updateLocal',{local:pickLocal, name: 'pick'})
            }else {
                res.render('notfound')
            }
        } catch (e){
            res.render('notfound')
        }
    }

    static async updateLocal(req,res){
        try {
            if (req.body.dropofLocaltion_name){
            const dropLocal = await DropofLocaltion.findOne({_id:req.body.id})
            dropLocal.dropofLocaltion_name = req.body.dropofLocaltion_name;
            await dropLocal.save();
            res.redirect('/adm/listlocals')
            }else if (req.body.pickupLocaltion_name){
                const pickLocal = await PickupLocaltion.findOne({_id:req.body.id})
                pickLocal.pickupLocaltion_name = req.body.pickupLocaltion_name;
                await pickLocal.save();
                res.redirect('/adm/listlocals')
            }else {
                res.render('notfound')
            }
        }catch (e){
            res.render('notfound')
        }
    }
}
export default  LocalController