const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  }
}, { _id: false });

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String, // Supports HTML/Markdown
    required: true,
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  samples: {
    type: [sampleSchema],
    validate: [arr => arr.length > 0, 'At least one sample is required'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  hiddenTests: [
  {
    inputFilePath: {
      type: String,
      required: true
    },
    outputFilePath: {
      type: String,
      required: true
    }
  }
],
}, {
  timestamps: true,
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
export { sampleSchema };
