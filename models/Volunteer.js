const mongoose = require("mongoose");
// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a VolunteerSchema
const VolunteerSchema = new Schema({
  name: {
    type: String,
    default: "",
    required: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address"
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "Volunteer"
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: "Volunteer"
  }]
});

// Create model from the schema
var Volunteer = mongoose.model("Volunteer", VolunteerSchema);

// Export model
module.exports = Volunteer