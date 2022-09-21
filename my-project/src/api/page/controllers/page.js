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
    console.log('page_data: ', page_data)
    try {
      const page = await strapi.entityService.create("api::page.page", {
        data: page_data,
      });
      /// do we need to create content when a page is created?
      /// we currently do not allow for that in the UI
      /// if we are not updating that, we can probably remove this?
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
    const { page_data = null, content_data = null } = ctx.request.body;
    try {
      if (id && content_data?.length) {
        // update contents
        // if there is no ID passed in with the content, it will create a new one
        const contents = await strapi
          .service("api::page.page")
          .updateContent(content_data, id);
          // error handling?
      }
      // we will have situations where page data is not updated, so we will have to
      // account for no page data
      let page;
      if (page_data) {
        page = await strapi.entityService.update("api::page.page", id, {
          data: page_data,
        });
      } else {
        page = await strapi.entityService.findOne("api::page.page", id, { 
            populate: ['contents.modules']
        });
      }
      // how can we return all of this data in one place?
      // if we go this route, the 'page' returned here is out of date
      // we would have to either have to refetch data or maybe move the content updates first?
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
