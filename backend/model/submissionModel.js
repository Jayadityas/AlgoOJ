import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: { type: String, required: true },
    language: { type: String, required: true },
    verdict: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Error",
        "Pending",
      ],
      default: "Pending",
    },
    output: { type: String },
    executionTime: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
