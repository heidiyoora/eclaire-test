"use strict";

/**
 * page service.
 */

const { isEmpty, merge } = require("lodash/fp");
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
  getModelPopulationAttributes(model) {
    if (model.uid === "plugin::upload.file") {
      const { related, ...attributes } = model.attributes;
      return attributes;
    }

    return model.attributes;
  },
  getFullPopulateObject(modelUid, maxDepth = 20) {
    // TODO: this is set up to be dynamic, but is currently only being used
    // by the Page controller, we can revisit as we find the need
    if (maxDepth <= 1) {
      return true;
    }

    if (modelUid === "admin::user") {
      return undefined;
    }

    const populate = {};
    const model = strapi.getModel(modelUid);
    for (const [key, value] of Object.entries(
      strapi.service("api::page.page").getModelPopulationAttributes(model)
    )) {
      if (value) {
        if (value.type === "component") {
          populate[key] = strapi.service("api::page.page").getFullPopulateObject(value.component, maxDepth - 1);
        } else if (value.type === "dynamiczone") {
          const dynamicPopulate = value.components.reduce((prev, cur) => {
            const curPopulate = strapi.service("api::page.page").getFullPopulateObject(cur, maxDepth - 1);
            return curPopulate === true ? prev : merge(prev, curPopulate);
          }, {});
          populate[key] = isEmpty(dynamicPopulate) ? true : dynamicPopulate;
        } else if (value.type === "relation") {
          const relationPopulate = strapi.service("api::page.page").getFullPopulateObject(
            value.target,
            maxDepth - 1
          );
          if (relationPopulate) {
            populate[key] = relationPopulate;
          }
        } else if (value.type === "media") {
          populate[key] = true;
        }
      }
    }

    return isEmpty(populate) ? true : { populate };
  }
}));
