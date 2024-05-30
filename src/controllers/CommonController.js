const sendResponse = require("../../utils/responseHandler");
const Tags = require("../models/Tags");
const Technology = require("../models/Technologies");

exports.addCommon = async (req, res) => {
  try {
    const { type, name } = req.body;

    if (!type || !name) {
      return sendResponse(res, 400, {}, "Type and name are required");
    }

    if (type === "tags") {
      const existingTag = await Tags.findOne({ name });

      if (existingTag) {
        return sendResponse(res, 400, {}, "Tag already exists");
      }

      const newTag = await Tags.create({
        ...req.body,
      });

      const tags = [
        {
          label: newTag.name,
          value: newTag._id,
        },
      ];

      return sendResponse(res, 201, tags, "Tag created successfully");
    } else if (type === "technology") {
      const existingTech = await Technology.findOne({ name });

      if (existingTech) {
        return sendResponse(res, 400, {}, "Technology already exists");
      }

      const newTech = await Technology.create({
        ...req.body,
      });

      const tech = [
        {
          label: newTech.name,
          value: newTech._id,
        },
      ];
      return sendResponse(res, 201, tech, "Technology created successfully");
    } else {
      return sendResponse(res, 400, {}, "Invalid type provided");
    }
  } catch (error) {
    return sendResponse(res, 500, {}, error.message);
  }
};

exports.getAllCommon = async (req, res) => {
  try {
    const { type } = req.query;

    if (type === "tags") {
      const tags = await Tags.aggregate([
        { $match: { status: true } },
        {
          $project: {
            label: "$name",
            value: "$_id",
          },
        },
      ]);

      return sendResponse(res, 200, { data: tags, type }, "fetched all tags");
    } else {
      const technologies = await Technology.aggregate([
        { $match: { status: true } },
        {
          $project: {
            label: "$name",
            value: "$_id",
          },
        },
      ]);

      return sendResponse(
        res,
        200,
        { data: technologies, type },
        "fetched all technologies"
      );
    }
  } catch (error) {
    return sendResponse(res, 500, {}, error.message);
  }
};
