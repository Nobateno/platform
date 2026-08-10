import _ from "lodash";

export interface Browser {
  image?: string;
  name: BrowserName;
}

type BrowserName = "Chrome" | "Edge" | "Firefox" | "Opera" | "Safari";

const browserImagePaths = {
  Chrome: undefined,
  Edge: undefined,
  Firefox: undefined,
  Opera: undefined,
  Safari: undefined,
} satisfies Record<BrowserName, string | undefined>;

const fakers = {
  fakeBrowsers() {
    const browsers: Array<Browser> = [
      {
        image: browserImagePaths.Chrome,
        name: "Chrome",
      },
      {
        image: browserImagePaths.Edge,
        name: "Edge",
      },
      {
        image: browserImagePaths.Firefox,
        name: "Firefox",
      },
      {
        image: browserImagePaths.Opera,
        name: "Opera",
      },
      {
        image: browserImagePaths.Safari,
        name: "Safari",
      },
    ];

    return _.shuffle(browsers);
  },
};

export default fakers;
