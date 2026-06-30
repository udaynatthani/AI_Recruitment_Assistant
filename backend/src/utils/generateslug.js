const slugify = require("slugify");
const { v4: uuid } = require("uuid");

const generateSlug = (title, company) => {
  const slug =
    slugify(`${title}-${company}`, {
      lower: true,
      strict: true,
      trim: true,
    }) +
    "-" +
    uuid().slice(0, 6);

  return slug;
};

module.exports = generateSlug;