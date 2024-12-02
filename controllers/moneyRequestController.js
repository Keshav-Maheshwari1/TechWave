import MoneyRequest from "../models/MoneyRequest.js"; // Import the MoneyRequest model

// Controller for handling MoneyRequest operations
export const createMoneyRequest = async (req, res) => {
  const { panchayat, phed, amountRequested, reason } = req.body;

  // Role-based access control (GP can only create)
  if (req.user.role !== "gp") {
    return res.status(403).json({
      message: "Unauthorized access. Only GP can create MoneyRequest",
    });
  }

  // Check if the panchayat and phed emails are the same (do not allow GPs to create requests with emails of other GPs)
  if (panchayat === phed) {
    return res
      .status(400)
      .json({ message: "GP cannot request money for themselves." });
  }

  try {
    const moneyRequest = new MoneyRequest({
      panchayat,
      phed,
      amountRequested,
      reason,
    });

    // Save the new money request
    await moneyRequest.save();
    res
      .status(201)
      .json({ message: "Money request created successfully", moneyRequest });
  } catch (err) {
    console.error("Error creating MoneyRequest:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getMoneyRequests = async (req, res) => {
  // Role-based access control (GP can only get their money requests)

  try {
    // Fetch money requests for the specific panchayat (GP can only see their own)
    const moneyRequests = await MoneyRequest.find({
      panchayat: req.user.email,
    });
    if (!moneyRequests || moneyRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No money requests found for this panchayat" });
    }

    res.status(200).json({ moneyRequests });
  } catch (err) {
    console.error("Error fetching MoneyRequests:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateMoneyRequest = async (req, res) => {
  const { requestId, status, approvedAmount, approvedDate } = req.body;

  // Role-based access control (Phed can only update the status, amount of requests)
  if (req.user.role !== "phed") {
    return res.status(403).json({
      message: "Unauthorized access. Only Phed can update MoneyRequest",
    });
  }

  try {
    const moneyRequest = await MoneyRequest.findById(requestId);
    if (!moneyRequest) {
      return res.status(404).json({ message: "MoneyRequest not found" });
    }

    // Only Phed can update requests, but cannot change Panchayat or Phed email
    moneyRequest.status = status || moneyRequest.status;
    moneyRequest.approvedAmount = approvedAmount || moneyRequest.approvedAmount;
    moneyRequest.approvedDate = approvedDate || moneyRequest.approvedDate;

    // Save the updated MoneyRequest
    await moneyRequest.save();
    res
      .status(200)
      .json({ message: "MoneyRequest updated successfully", moneyRequest });
  } catch (err) {
    console.error("Error updating MoneyRequest:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteMoneyRequest = async (req, res) => {
  const { email } = req.params;

  // Role-based access control (Phed can delete requests)
  if (req.user.role !== "phed") {
    return res.status(403).json({
      message: "Unauthorized access. Only Phed can delete MoneyRequest",
    });
  }

  try {
    const moneyRequest = await MoneyRequest.findOne({ email: email });
    if (!moneyRequest) {
      return res.status(404).json({ message: "MoneyRequest not found" });
    }

    // Delete the MoneyRequest
    await MoneyRequest.findOneAndDelete({ email: email });
    res.status(200).json({ message: "MoneyRequest deleted successfully" });
  } catch (err) {
    console.error("Error deleting MoneyRequest:", err);
    return res.status(500).json({ error: err.message });
  }
};
