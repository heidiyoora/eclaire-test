"use strict";

/**
 *  page controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::page.page", ({ strapi }) => ({
  async find(ctx) {
    // api/pages?filters[url][$eq]=URL
    const { query } = ctx;

    const entity = await super.find({
      ...ctx,
      query: {
        ...query,
        populate: [
          // create populate query for page and content specific data
          // will probably need to add a few more
          "socialImage",
          "contents.modules.image",
          "contents.modules.elements",
          "contents.modules.products",
          "contents.modules.box_elements",
          "contents.modules.circle_elements",
        ],
      },
    });

    return entity;
  },
  async createPage(ctx) {
    const { page_data, content_data } = ctx.request.body;
    try {
      const page = await strapi.entityService.create("api::page.page", {
        data: page_data,
      });

      if (page && page.id && content_data?.length) {
        // create multiple contents and associate with page
        const contents = await strapi
          .service("api::page.page")
          .createContent(content_data, page.id);
        return { page, contents };
      }
      return page;
    } catch {
      ctx.throw(500, err);
    }
  },
  async updatePage(ctx) {
    const { id } = ctx.request.params;
    const { page_data, content_data } = ctx.request.body;
    try {
      const page = await strapi.entityService.update("api::page.page", id, {
        data: page_data,
      });

      if (id && content_data?.length) {
        // update contents
        const contents = await strapi
          .service("api::page.page")
          .updateContent(content_data, id);
        return { page, contents };
      }
      return page;
    } catch {
      ctx.throw(500, err);
    }
  },
  async deletePage(ctx) {
    const { id } = ctx.request.params;
    try {
      const page = await strapi.entityService.delete("api::page.page", id);
      return page;
    } catch {
      ctx.throw(500, err);
    }
  },
}));
