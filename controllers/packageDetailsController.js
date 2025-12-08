import PackageDetails from "../models/PackageDetails.js";
import Package from "../models/Package.js"; // ✅ Add this import

export const addPackageDetails = async (req, res) => {
  try {
    const details = new PackageDetails(req.body);
    await details.save();
    
    res.status(201).json({
      message: "Package details added successfully",
      data: details
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Fixed - renamed 'package' to 'packageData'
export const getPackageDetails = async (req, res) => {
  try {
    const packageId = req.params.id;
    console.log("📦 Fetching package for ID:", packageId);
    
    // Fetch the main package by _id
    const packageData = await Package.findById(packageId);

    if (!packageData) {
      console.log("❌ Package not found");
      return res.status(404).json({ 
        success: false,
        message: "Package not found" 
      });
    }

    console.log("✅ Package found:", packageData.title);

    // Optionally, check if extended marketing details exist
    const extendedDetails = await PackageDetails.findOne({ packageId: packageId });
    
    // Merge if extended details exist, otherwise just return package
    const response = extendedDetails 
      ? { ...packageData.toObject(), ...extendedDetails.toObject() }
      : packageData.toObject();

    res.json({ 
      success: true, 
      package: response 
    });
    
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};