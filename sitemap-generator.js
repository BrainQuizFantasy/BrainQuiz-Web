require("babel-register")({
  presets: ["es2015", "react"],
});

const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

// Load environment variables
require('dotenv').config();

function generateSitemap() {
  let baseurl = process.env.REACT_APP_WEB_URL;
  var mySitemap = new Sitemap(router).build(baseurl);
  for (let i = 0; i < mySitemap.sitemaps[0].urls.length; i++) {
    mySitemap.sitemaps[0].urls[i].changefreq = "daily";
    mySitemap.sitemaps[0].urls[i].priority = 0.8;
  }

  mySitemap.save("./public/sitemap.xml");
}

generateSitemap();
