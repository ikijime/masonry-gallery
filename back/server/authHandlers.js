const users = {
  [process.env.ADMIN_LOGIN]: process.env.ADMIN_PASSWORD,
};

const signinHandler = (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    res.json({ auth: false });
    return;
  }

  const expectedPassword = users[username];
  if (!expectedPassword || expectedPassword !== password) {
    res.json({ auth: false });
    return;
  }

  req.session.auth = true;
  res.json({ auth: req.session.auth });
  res.end();
};

const authHandler = (req, res) => {
  if (!req.session.cookie) {
    res.json({ auth: false });
    return;
  }

  if (!req.session.auth) {
    res.json({ auth: false });
    return;
  }

  res.json({ auth: req.session.auth });
  res.end();
};

const logoutHandler = (req, res) => {
  if (!req.session.cookie) {
    res.status(401).end();
    return;
  }

  if (req.session.auth) {
    req.session.destroy();
    res.end();
  }
};

module.exports = {
  signinHandler,
  authHandler,
  logoutHandler,
};
