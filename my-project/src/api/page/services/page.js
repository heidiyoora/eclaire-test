"use strict";

/**
 * page service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::page.page", ({ strapi }) => ({
  async createContent(contents, id) {
    return await Promise.all(
      contents.map(async (content) => {
        return await strapi.entityService.create("api::content.content", {
          data: { ...content, page: id },
        });
      })
    );
  },
  async updateContent(contents, id) {
    return await Promise.all(
      contents.map(async (content) => {
        // check if content already exist then update otherwise create it.
        return content.id
          ? await strapi.entityService.update(
              "api::content.content",
              content.id,
              { data: { ...content, page: id } }
            )
          : await strapi.entityService.create("api::content.content", {
              data: { ...content, page: id },
            });
      })
    );
  },
}));
