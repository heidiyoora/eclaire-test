module.exports = {
  myJob: {
    task: async () => {
      console.log(new Date());

      // fetch articles to publish
      const draftArticleToPublish = await strapi.db
        .query("api::page.page")
        .findMany({
          where: {
            publishedAt: {
              $null: true,
            },
            publish_at: {
              $lt: new Date(),
            },
          },
        });

      // update published_at of articles
      await Promise.all(
        draftArticleToPublish.map((article) => {
          return strapi
            .service("api::page.page")
            .update(article.id, { data: { publishedAt: new Date() } });
        })
      );
    },
    options: {
      rule: "*/1 * * * *",
      tz: "Europe/Istanbul",
    },
  },
};
