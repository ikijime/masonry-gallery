CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL,
  filepath text NOT NULL,
  description text,
  size INTEGER,
  visible BOOLEAN NOT NULL CHECK (visible IN (0, 1)),
  directory BOOLEAN NOT NULL CHECK (visible IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- INSERT INTO images(name, filepath, description) VALUES ('TestName', 'Test/File/Path', 'Some test description. Lorem ipsum, cogito ergo sum.');