// packageMigrationController.js
// Add this to your controllers folder

import Package from "../models/Package.js";
import Partner from "../models/partner.js";

// 🔧 Assign a specific partner to all packages without a partner
export const assignPartnerToPackages = async (req, res) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "Partner ID is required"
      });
    }

    // Verify partner exists
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    // Update all packages that don't have a partner
    const result = await Package.updateMany(
      { 
        $or: [
          { partner: { $exists: false } },
          { partner: null }
        ]
      },
      { partner: partnerId }
    );

    res.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} packages`,
      partnerId: partnerId,
      partnerName: partner.companyName,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("❌ Error assigning partner:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🔍 Check packages without partners
export const checkPackagesWithoutPartner = async (req, res) => {
  try {
    const packagesWithoutPartner = await Package.find({
      $or: [
        { partner: { $exists: false } },
        { partner: null }
      ]
    }).select('_id title price createdAt');

    res.json({
      success: true,
      count: packagesWithoutPartner.length,
      packages: packagesWithoutPartner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 📊 Get package statistics
export const getPackageStats = async (req, res) => {
  try {
    const totalPackages = await Package.countDocuments();
    const packagesWithPartner = await Package.countDocuments({
      partner: { $exists: true, $ne: null }
    });
    const packagesWithoutPartner = totalPackages - packagesWithPartner;

    // Get packages grouped by partner
    const packagesByPartner = await Package.aggregate([
      {
        $match: {
          partner: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: "$partner",
          count: { $sum: 1 },
          packages: { $push: { title: "$title", _id: "$_id" } }
        }
      },
      {
        $lookup: {
          from: "partners",
          localField: "_id",
          foreignField: "_id",
          as: "partnerInfo"
        }
      },
      {
        $unwind: "$partnerInfo"
      },
      {
        $project: {
          partnerId: "$_id",
          partnerName: "$partnerInfo.companyName",
          packageCount: "$count",
          packages: 1
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalPackages,
        withPartner: packagesWithPartner,
        withoutPartner: packagesWithoutPartner
      },
      packagesByPartner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};