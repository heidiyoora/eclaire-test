module.exports = {
  myJob: {
    task: async () => {
      // fetch uncoupled content
      const contents = await strapi.db.query("api::content.content").findMany({
        where: {
          page: null,
        },
      });

      if (contents.length) {
        // collect content ids in order to delete in bulk
        const contentIds = contents.map((content) => content.id);

        // delete uncoupled content
        await strapi.db.query("api::content.content").deleteMany({
          where: { id: contentIds },
        });
      }
    },
    options: {
      rule: "* * * * */0",
      tz: "Europe/Istanbul",
    },
  },
};
