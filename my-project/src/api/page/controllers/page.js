"use strict";

/**
 *  page controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::page.page", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const { results, meta } = await strapi.service("api::page.page").find({
      ...strapi.service("api::page.page").getFullPopulateObject("api::page.page"),
      ...query,
    });

    const sanitizedEntities = await this.sanitizeOutput(results, ctx);
    // TODO: this will return a list of one entities
    // should we update this to only return one? would we only be using this
    // as a way to query by url vs findOne by id?
    // this is current functionality so leaving for now
    return {
      data: sanitizedEntities,
      meta,
    };
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.service("api::page.page").findOne(id, {
      ...strapi.service("api::page.page").getFullPopulateObject("api::page.page")
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    // returns one entity by id
    return {
      data: sanitizedEntity
    };
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
    } catch (error) {
      ctx.throw(500, error);
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
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async deletePage(ctx) {
    const { id } = ctx.request.params;
    try {
      const page = await strapi.entityService.delete("api::page.page", id);
      return page;
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
