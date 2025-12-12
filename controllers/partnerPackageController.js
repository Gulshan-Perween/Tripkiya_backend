import partner from "../models/partner.js";
import partnerPackage from "../models/partnerPackage.js";
import { assignPartnerToPackages } from "./packageMigrationController.js";


// -------------------- Create Package --------------------
export const createPartnerPackage = async (req, res) => {
  try {
        req.body.partner = req.partner._id;
        const partnerBro = await partner.findById(req.partner._id)


    const partnerId = req.body.partner;
    console.log(partner);


    const newPackage = await partnerPackage.create({
      ...req.body,
      createdByPartner: partnerId,
    });
    partnerBro.packages.push(newPackage._id);
    await partnerBro.save();
    console.log("✅ Saved package with company details:", newPackage.toObject());
    console.log(partnerBro.packages);
    res.status(201).json({
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Get My Packages --------------------
export const getMyPackages = async (req, res) => {
  try {
    
    const packages = await partnerPackage.find({
      createdByPartner: req.partner._id,
    });
    console.log(req.partner._id);
    
    console.log("--->",packages);

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Update Package --------------------
export const updatePartnerPackage = async (req, res) => {
  try {
    const updated = await PartnerPackage.findOneAndUpdate(
      {
        _id: req.params.id,
        createdByPartner: req.partner._id,
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Package not found or unauthorized" });
    }

    res.json({
      message: "Package updated successfully",
      package: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Delete Package --------------------
export const deletePartnerPackage = async (req, res) => {
  try {
    const deleted = await partnerPackage.findOneAndDelete({
      _id: req.params.id,
      createdByPartner: req.partner._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Package not found or unauthorized" });
    }

    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllMyPackages = async(req,res) => {
  try{
    const pID = req.params.id;
    const partnerbro = await partner.findById(pID);
    const packages = await partnerPackage.find({
      _id: { $in: partnerbro.packages }
    });    
    res.json({
      packages
    })

  }catch(err){
    console.log(err);
  }
};