'use strict';

/**
 *  page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::page.page', ({strapi}) => ({
  async find(ctx) {
    // api/pages?filters[url][$eq]=URL
    const { query } = ctx;

    const entity = await super.find({ 
      ...ctx, 
      query: { ...query, populate: [
        // create populate query for page and content specific data
        // will probably need to add a few more
        'socialImage', 'contents.modules.image',
        'contents.modules.elements', 'contents.modules.products',
        'contents.modules.box_elements', 'contents.modules.circle_elements'
      ] }
    });

    return entity;
  }
}));
