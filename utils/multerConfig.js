const multer = require("multer");
const path = require("path");
const { storage } = require("./firebaseconfig");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("img");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
}

async function uploadToFirebase(file) {
  const fileName = `${file.fieldname}-${Date.now()}${path.extname(
    file.originalname
  )}`;
  const bucket = storage.bucket();
  const fileUpload = bucket.file(fileName);

  try {
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    const [url] = await fileUpload.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });
    return url;
  } catch (error) {
    console.error("Firebase upload error:", error);
    throw new Error("Something went wrong uploading to Firebase!");
  }
}

function uploadMiddleware(req, res, next) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: `Upload Error: ${err.message}` });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const firebaseUrl = await uploadToFirebase(req.file);
      req.img = firebaseUrl;
      next();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
}

module.exports = uploadMiddleware;
