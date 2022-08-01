const fs = require("fs");
const sharp = require("sharp");
const db = require("better-sqlite3")("./db/images.db");
const fileMiddleware = require("./multer");

function checkImageFolderExists(folderPath = "") {
  if (!fs.existsSync(`${process.env.STATIC_FILES}/${folderPath}`)) {
    fs.mkdirSync(`${process.env.STATIC_FILES}/${folderPath}`);
  }

  if (!fs.existsSync(`${process.env.STATIC_FILES}/${folderPath}/thumbnails`)) {
    fs.mkdirSync(`${process.env.STATIC_FILES}/${folderPath}/thumbnails`);
  }

  if (
    !fs.existsSync(
      `${process.env.STATIC_FILES}/${folderPath}/thumbnails/small/`
    )
  ) {
    fs.mkdirSync(`${process.env.STATIC_FILES}/${folderPath}/thumbnails/small/`);
  }
}

function processImages(images, fileFolderPath = "") {
  const len = images.length;
  for (let i = 0; i < len; i += 1) {
    const image = images[i];
    let imageFolder = `${process.env.STATIC_FILES}`;

    // If folderPath is set then move images to that folder
    if (fileFolderPath && fileFolderPath.length > 0) {
      imageFolder = `${process.env.STATIC_FILES}/${fileFolderPath}`;
      fs.rename(
        `${process.env.STATIC_FILES}/${image.filename}`,
        `${process.env.STATIC_FILES}/${fileFolderPath}/${image.filename}`,
        (err) => {
          if (err) throw err;
          console.log("Successfully moved.");
        }
      );
      image.path = `${process.env.STATIC_FILES}/${fileFolderPath}/${image.filename}`;
    }

    const stmt = db.prepare(
      "INSERT INTO images (name, filepath, description, size, visible, directory) VALUES (?, ?, ?, ?, ?, ?)"
    );

    checkImageFolderExists(fileFolderPath);

    stmt.run(image.filename, fileFolderPath, "", image.size, 1, 0);
    // 600px for preview
    sharp(image.path)
      .resize({
        width: 500,
        fit: "outside",
      })
      .withMetadata()
      .toFile(`${imageFolder}/thumbnails/${image.filename}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    // 100px for menu
    sharp(image.path)
      .resize({
        width: 100,
        fit: "outside",
      })
      .withMetadata()
      .toFile(`${imageFolder}/thumbnails/small/${image.filename}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
  }
}

function saveFiles(req, res) {
  if (!req.session.auth) {
    res.send(401);
    return;
  }

  const { fileFolderPath } = req.body;

  if (req.files === undefined || req.files.length === 0) {
    res.json({ error: "No files provided" });
    return;
  }

  processImages(req.files, fileFolderPath);
  res.send({
    status: true,
    message: "Files is uploaded",
  });
}

function deleteFile(filename, folderPath = "") {
  const staticPath = `${process.env.STATIC_FILES}/${folderPath}`;
  const stmt = db.prepare("DELETE FROM images WHERE name = ?");
  const filePath = `${staticPath}/${filename}`;
  const thumbnailsFilepath = `${staticPath}/thumbnails/${filename}`;
  const smallThumbnailsFilePath = `${staticPath}/thumbnails/small/${filename}`;
  const filePaths = [filePath, thumbnailsFilepath, smallThumbnailsFilePath];

  filePaths.forEach((path) => {
    if (fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
    }
  });

  stmt.run(filename);
}

module.exports = (app) => {
  function isDirectory(path) {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
  }

  // app.get('/api/filesystem/', (req, res) => {
  //   const staticPath = process.env.STATIC_FILES;
  //   const path = req.query.path ? req.query.path : '';

  //   if (isDirectory(`${staticPath}/${path}`)) {
  //     const files = fs.readdirSync(`${staticPath}/${path}`).map((item) => {
  //       const fullPath = `${staticPath}/${path}/${item}`;
  //       const isDir = fs.lstatSync(fullPath).isDirectory();
  //       let size = 0;
  //       if (!isDir) size = fs.lstatSync(fullPath);

  //       return {
  //         name: item,
  //         dir: isDir,
  //         size: size.size ?? 0,
  //       };
  //     });
  //     res.json({
  //       files,
  //     });
  //   } else {
  //     res.json({ error: 'empty' });
  //   }
  // });

  app.get("/api/filesystem/", (req, res) => {
    const path = req.query.path ? req.query.path : "";
    const stmt = db.prepare("SELECT * FROM images WHERE filepath = ?");
    const imagesFromDb = stmt.all(path);
    res.json({ files: imagesFromDb });
  });

  app.post("/api/filesystem/", (req, res) => {
    if (!req.session.auth) {
      res.send(401);
      return;
    }

    const path = req.body.path ? req.body.path : "";
    if (!isDirectory(`${process.env.STATIC_FILES}/${path}`)) {
      fs.mkdirSync(`${process.env.STATIC_FILES}/${path}`);
      const stmt = db.prepare(
        "INSERT INTO images (name, filepath, description, size, visible, directory) VALUES (?, ?, ?, ?, ?, ?)"
      );
      stmt.run(path, "", "", 0, 1, 1);
    } else {
      res.json({ error: 'folder already exists'});
    }
  });

  app.get("/api/files/:page", (req, res) => {
    const images = getFiles(req.params.page);
    res.json({ images });
  });

  function getFiles(page = 1) {
    const offset = (page - 1) * 4;
    const stms = db.prepare("SELECT * FROM images WHERE directory = false LIMIT ?, ? ");
    const queryResult = stms.all(offset, 4);
    return queryResult;
  }
  
  app.patch("/api/files/:id", (req, res) => {
    const stmt = db.prepare(
      "UPDATE images SET visible = NOT visible WHERE id = ?"
    );
    stmt.run(req.params.id);

    // stmt.run(image.filename, fileFolderPath, '', image.size, 1);
    res.json(req.params.id);
  });

  app.post("/api/files", fileMiddleware.array("photos"), saveFiles);

  app.delete("/api/files/(*/)?:filename*", (req, res) => {
    if (!req.session.auth) {
      res.send(401);
      return;
    }

    const folderPath = req.params[0];
    const { filename } = req.params;

    if (filename) {
      deleteFile(filename, folderPath);
      res.status(200).send({});
    } else {
      res.status(400).send("Please specify a filename");
    }
  });
};
