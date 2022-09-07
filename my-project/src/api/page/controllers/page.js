'use strict';

/**
 *  page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::page.page', ({strapi}) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await super.find({ 
      ...ctx, 
      query: { ...query, populate: [
        // create populate query with page and content specific
        // will probably need to add a few more
        'socialImage', 'contents.modules.image',
        'contents.modules.elements', 'contents.modules.products'
      ] }
    });

    return entity;
  }
}));
