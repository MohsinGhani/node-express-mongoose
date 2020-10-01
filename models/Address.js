const mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a AddressSchema
const AddressSchema = new Schema({
    line1: {
        type: String,
        required: true,
    },
    line2: {
        type: String,
        default: "",
        required: false,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }
});

// Create model from the schema
var Address = mongoose.model("Address", AddressSchema);

// Export model
module.exports = Address
