const { default: mongoose } = require("mongoose");

class LeadModels {
  static leadSchema() {
    return (
      mongoose.models.lead ||
      mongoose.model('lead',
        new mongoose.Schema(
          {
            ownerId:String,
            leadName: String,
            contactNumber: String,
            email: String,
            address: String,
            status: String,
            assignedTo: String,
            nextFollowUpDate: Date,
            leadSource: String,
            conversionDate: Date,
            leadNotes: String,
            customerType: String,
            purchaseHistory: Array,
            medicalNeeds: String,
          },
          { timestamps: true }
        )
      )
    );
  }
}
module.exports = LeadModels;
