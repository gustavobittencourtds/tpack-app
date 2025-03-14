module.exports = {
  async redirects() {
    return [
      {
        source: '/admin',
        permanent: true,
      },
    ];
  },
};
