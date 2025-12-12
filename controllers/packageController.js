import Package from "../models/Package.js";



export const addPackage = async (req, res) => {
  try {
    console.log("📦 Incoming package data:", req.body);

    // 🧹 Remove _id if it exists (prevents duplicate key errors)
    if (req.body._id) delete req.body._id;

    // 🧩 Clean itinerary objects (remove any nested _id fields)
    if (Array.isArray(req.body.itinerary)) {
      req.body.itinerary = req.body.itinerary.map(({ day, details }) => ({
        day,
        details,
      }));
    }

    // ✅ Create and save new package
    const newPackage = new Package(req.body);
    await newPackage.save();

        console.log("✅ Saved package with company details:", newPackage.toObject());

    res.status(201).json(newPackage);
  } catch (error) {
    console.error("❌ Error creating package:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// export const addPackage = async (req, res) => {
//   try {
//     console.log("📦 Incoming package data:", req.body);

//     if (req.body._id) delete req.body._id;

//     if (Array.isArray(req.body.itinerary)) {
//       req.body.itinerary = req.body.itinerary.map(({ day, details }) => ({
//         day,
//         details,
//       }));
//     }

//     // 🔥 ATTACH PARTNER
//     req.body.partner = req.partner._id;

//     const newPackage = await Package.create(req.body);

//     console.log("✅ Saved package:", newPackage.toObject());

//     res.status(201).json(newPackage);
//   } catch (error) {
//     console.error("❌ Error creating package:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };


export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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