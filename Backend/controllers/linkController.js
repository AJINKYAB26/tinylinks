const Link = require('../models/Link');
const { generateCode } = require('../utils/validators');

/**
 * POST /api/links
 * Body: { target: string, code?: string }
 * Responses:
 *  - 201 created with link object
 *  - 400 invalid input
 *  - 409 if code exists
 */
async function createLink(req, res, next) {
  try {
    const { target, code } = req.body;
    if (!target) {
      return res.status(400).json({ error: 'target is required and must be a valid URL (include http/https)' });
    }

    // Treat empty "" as NO CODE
    const desiredCode = (typeof code === 'string' && code.trim().length > 0)
      ? code.trim()
      : null;

    // Validate custom code ONLY if provided and non-empty
    if (desiredCode && !/^[A-Za-z0-9]{6,8}$/.test(desiredCode)) {
      return res.status(400).json({ error: 'code must match [A-Za-z0-9]{6,8}' });
    }

    // If code provided, check uniqueness
    if (desiredCode) {
      const exists = await Link.findOne({ code: desiredCode }).exec();
      if (exists) return res.status(409).json({ error: 'code already exists' });
      const link = new Link({ code: desiredCode, target });
      await link.save();
      return res.status(201).json(link);
    }

    // auto-generate a unique code length 6 (try up to some attempts)
    let newCode;
    let attempts = 0;
    while (attempts < 5) {
      newCode = generateCode(6);
      // ensure not existing
      // eslint-disable-next-line no-await-in-loop
      const exists = await Link.findOne({ code: newCode }).exec();
      if (!exists) break;
      attempts++;
    }
    if (attempts >= 5) {
      // fallback try lengths up to 8 with more checks
      let found = false;
      for (let len = 7; len <= 8 && !found; len++) {
        for (let i = 0; i < 10 && !found; i++) {
          // eslint-disable-next-line no-await-in-loop
          const c = generateCode(len);
          // eslint-disable-next-line no-await-in-loop
          const exists = await Link.findOne({ code: c }).exec();
          if (!exists) {
            newCode = c;
            found = true;
          }
        }
      }
    }

    const link = new Link({ code: newCode, target });
    await link.save();
    return res.status(201).json(link);
  } catch (err) {
    // Duplicate key -> code collision
    if (err.code === 11000) return res.status(409).json({ error: 'code already exists' });
    return next(err);
  }
}

/**
 * GET /api/links
 * List all links
 */
async function listLinks(req, res, next) {
  try {
    const links = await Link.find().sort({ createdAt: -1 }).exec();
    return res.json(links);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/links/:code
 * Return stats for single code
 */
async function getLink(req, res, next) {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code }).exec();
    if (!link) return res.status(404).json({ error: 'Not found' });
    return res.json(link);
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/links/:code
 * Delete link by code
 */
async function deleteLink(req, res, next) {
  try {
    const { code } = req.params;
    const deleted = await Link.findOneAndDelete({ code }).exec();
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /:code  (redirect route)
 * Performs 302 to original target and increments click count & lastClickedAt
 */
async function redirectToTarget(req, res, next) {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code }).exec();
    if (!link) return res.status(404).send('Not found');

    // Increment clicks and update last clicked
    link.clicks += 1;
    link.lastClickedAt = new Date();
    await link.save();

    // 302 redirect
    return res.redirect(302, link.target);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createLink,
  listLinks,
  getLink,
  deleteLink,
  redirectToTarget
};
