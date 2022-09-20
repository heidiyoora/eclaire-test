module.exports = {
    routes: [
      {
        method: "POST",
        path: "/pages/create",
        handler: "page.createPage"
      },
      {
        method: "PUT",
        path: "/pages/update/:id",
        handler: "page.updatePage"
      },
      {
        method: "DELETE",
        path: "/pages/delete/:id",
        handler: "page.deletePage"
      }
    ]
  }