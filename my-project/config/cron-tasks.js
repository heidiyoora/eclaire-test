module.exports = {
  myJob: {
    task: async () => {
      console.log(new Date());

      // fetch uncouple content
      const contents = await strapi.db.query("api::content.content").findMany({
        where: {
          page: null,
          updatedAt: {
            // check page updated 7 days before
            $lt: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      if (contents?.length) {
        // collect content ids in order to delete in bulk
        const contentIds = contents.map((content) => content.id);

        // delete uncoupled content
        await strapi.db.query("api::content.content").deleteMany({
          where: { id: contentIds },
        });
      }
    },
    options: {
      rule: "* */9 * * *",
      tz: "Europe/Istanbul",
    },
  },
};
