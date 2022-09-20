"use strict";

/**
 * page service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::page.page", ({ strapi }) => ({
  async createContent(content_data, id) {
    return await Promise.all(
      content_data.map(async (data) => {
        // injecting page id to associate content with page
        data["page"] = id;
        return await strapi.entityService.create("api::content.content", {
          data,
        });
      })
    );
  },
  async updateContent(content_data, id) {
    return await Promise.all(
      content_data.map(async (data) => {
        // injecting page id to associate content with page
        data["page"] = id;
        return await strapi.entityService.update(
          "api::content.content",
          data.id,
          { data }
        );
      })
    );
  },
}));
