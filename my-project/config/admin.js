module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '42e23011efd6a1982479b99b41173f42'),
  },
});
