#!/usr/bin/env node

const fs = require("fs");
const needle = require("needle");
const filenamify = require("filenamify");
const CONFIG_FILE = ".config.json";

let lastRun = null;
try {
  ({ lastRun } = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8")));
} catch (error) {}

const saveSpace = async (space) => {
  try {
    console.log(space.name);

    const response = await needle(
      "get",
      `http://api.kinopio.club/space/${space.id}`,
      {
        headers: { Authorization: apiKey },
      }
    );
    if (response.statusCode == 200) {
      fs.writeFileSync(
        filenamify(space.name) + ".json",
        JSON.stringify(response.body, null, 2),
        "utf-8"
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const saveSpaces = async () => {
  try {
    const response = await needle(
      "get",
      "http://api.kinopio.club/user/spaces",
      {
        headers: { Authorization: process.env.API_KEY },
      }
    );
    if (response.statusCode == 200) {
      for (const space of response.body) {
        console.log(space.name);
        if (lastRun == null || new Date(lastRun) < new Date(space.updatedAt)) {
          await saveSpace(space);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

saveSpaces()
  .then(() => {
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify({ lastRun: new Date() }, "utf8")
    );
  })
  .catch((e) => console.error(e));
