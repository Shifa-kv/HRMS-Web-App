import { webpack } from "webpack"
module.exports = {
  resolve: {
    fallback: {
        crypto: false,
        stream: false,
    },
  },
  // Your additional configuration options can go here if needed
};
