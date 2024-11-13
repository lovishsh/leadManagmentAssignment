const LeadModels = require("../models/leadModels");

class LeadController {
  static async create(req, res) {
    try {
      const { userId } = req.user;
      const leadModel = LeadModels.leadSchema();
      const newData = new leadModel({
        ownerId: userId,
        ...req.body,
      });
      await newData.save();
      res.status(201).json({ message: "Lead created successfully",statusCode:201 });
    } catch (error) {
        console.log(error);
      return res.status(500).json({
        error: "internal server",
        statusCode: 500,
      });
    }
  }
  static async fetch(req, res) {
    const { page = 1, limit = 10, order = "asc" } = req.query;
    try {
      const { userId } = req.user;
      const leadModels = LeadModels.leadSchema();
      const pageInt=parseInt(page);
      const limitInt=parseInt(limit);
      const aggregate =await leadModels.aggregate([
        {
            $match:{ownerId:userId}
        },
        {
          $sort: {createdAt:order === "asc" ? 1 : -1},
        },
        {
          $limit: limitInt,
        },
        {
          $skip: (pageInt-1)*limitInt,
        },
      ]);
      return res.status(200).json({
        data:aggregate
      })
    } catch (error) {
        console.log(error);
      return res.status(500).json({
        error: "internal server",
        statusCode: 500,
      });
    }
  }

  static async update(req,res){
    const {id}=req.query;
    try {
        const leadModel=LeadModels.leadSchema();
        const data=await leadModel.findById(id);
        if(!data){
            return res.status(404).json({
                error: "Data Not Found",
                statusCode: 404,
              });
        }
        await leadModel.updateOne({_id:id},{
            $set:{...req.body}
        })
        res.status(200).json({ message: "Lead updated successfully",statusCode:200 });
    } catch (error) {
        return res.status(500).json({
            error: "internal server",
            statusCode: 500,
          });
    }
  }
  static async delete(req,res){
    const {id}=req.query;
    try {
        const leadModel=LeadModels.leadSchema();
        const data=await leadModel.findById(id);
        if(!data){
            return res.status(404).json({
                error: "Data Not Found",
                statusCode: 404,
              });
        }
        await leadModel.deleteOne({_id:id})
        res.status(200).json({ message: "Lead deleted successfully",statusCode:200 });
    } catch (error) {
        return res.status(500).json({
            error: "internal server",
            statusCode: 500,
          });
    }
  }
}
module.exports = LeadController;
