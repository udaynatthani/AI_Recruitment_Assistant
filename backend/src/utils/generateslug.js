const slugify = require("slugify");

const generateSlug = (title, company) => {
    return slugify(
        `${title}-${company}`,
        {
            lower: true,
            strict: true,
            trim: true
        }
    );
};

module.exports = generateSlug;