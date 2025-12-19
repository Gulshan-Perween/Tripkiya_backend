import Package from "../models/Package.js";





export const addPackage = async (req, res) => {
  try {
    console.log("📦 Incoming package data:", req.body);
    console.log("👤 User info:", req.user);

    // 🧹 Remove _id if it exists
    if (req.body._id) delete req.body._id;

    // 🧩 Clean itinerary objects
    if (Array.isArray(req.body.itinerary)) {
      req.body.itinerary = req.body.itinerary.map(({ day, details }) => ({
        day,
        details,
      }));
    }

    // ✅ Handle partner field based on user role
    const packageData = {
      ...req.body,
      createdBy: req.user._id,
    };

    // If user is a partner, set the partner field
    if (req.user.role === "partner") {
      packageData.partner = req.user._id;
    }
    // If admin is creating on behalf of a partner, use the partner from req.body
    else if (req.user.role === "admin" && req.body.partner) {
      packageData.partner = req.body.partner;
    }
    // Otherwise, leave partner as null (for admin-created packages)

    // ✅ Create and save new package
    const newPackage = new Package(packageData);
    await newPackage.save();

    console.log("✅ Saved package:", newPackage.toObject());

    res.status(201).json(newPackage);
  } catch (error) {
    console.error("❌ Error creating package:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("partner", "agencyName email phone") // ✅ partner data
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getPackageById = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const singlePackage = await Package.findById(id);
    if (!singlePackage) return res.status(404).json({ message: "Package not found" });
    res.status(200).json({ success: true, singlePackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
            const id = req.params.id.trim();

    const updated = await Package.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Package updated", updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
        const id = req.params.id.trim();

    await Package.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteAllPackages = async (req, res) => {
  try {
    const result = await Package.deleteMany({});
    console.log(result); // { acknowledged: true, deletedCount: X }

    res.status(200).json({
      message: 'All packages deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting packages' });
  }
};