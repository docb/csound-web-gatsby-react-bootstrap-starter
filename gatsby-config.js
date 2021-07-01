module.exports = {
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
/*
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `csound-web-gatsby-react-bootstrap-starter`,
        short_name: `csound-web`,
        start_url: `/`,
        background_color: `#20232a`,
        theme_color: `#20232a`,
        display: `minimal-ui`,
	      icon: 'src/images/icon.png',
      },
    },
*/
  ],
}
