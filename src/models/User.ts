import mongoose from "mongoose";

const Schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
  streetName: {
    type: Schema.Types.String,
    required: true,
  },
  streetNum: {
    type: Schema.Types.String,
    required: true,
  },
  district: {
    type: Schema.Types.String,
    required: true,
  },
  city: {
    type: Schema.Types.String,
    required: true,
  },
  uf: {
    type: Schema.Types.String,
    required: true,
  },
  cep: {
    type: Schema.Types.String,
    required: true,
  },
});

const User = mongoose.model(
  "User",
  new Schema(
    {
      whatsNumber: {
        type: Schema.Types.String,
        required: true,
        index: true,
        unique: true,
      },
      whatsFormated: {
        type: Schema.Types.String,
        required: true,
      },
      name: {
        type: Schema.Types.String,
        required: true,
      },
      cpf: {
        type: Schema.Types.String,
        required: true,
        index: true,
        unique: true,
      },
      locations: [addressSchema],
      speciality: {
        type: Schema.Types.String,
        default: null,
      },
      createdAt: {
        type: Schema.Types.Date,
        default: null,
      },
      updatedAt: {
        type: Schema.Types.Date,
        default: null,
      },
      deletedAt: {
        type: Schema.Types.Date,
        default: null,
      },
    },
    { timestamps: true }
  )
);

export default User;
//export default mongoose.models.User || mongoose.model("User", User);
