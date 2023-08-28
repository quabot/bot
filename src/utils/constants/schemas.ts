export const reqString = {
  type: String,
  required: true,
};

export const optString = {
  type: String,
  required: false,
};

export const reqNum = {
  type: Number,
  required: true,
  default: 0,
};

export const optObject = {
  type: Object,
  required: false,
};

export const optId = {
  type: Number,
  default: 1,
  required: true,
};

export const reqBool = {
  type: Boolean,
  required: true,
};

export const reqObject = {
  type: Object,
  required: true,
};

export const reqArray = {
  type: Array,
  required: true,
};
