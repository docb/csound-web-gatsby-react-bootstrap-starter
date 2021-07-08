module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: `your title`,
    description: `a web-csound instrument for sound generation`,
  },
  flags: {
    DEV_SSR: false
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
  ],
}
