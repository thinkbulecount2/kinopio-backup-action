#!/usr/bin/env node

const fs = require("fs");
const needle = require("needle");
const filenamify = require("filenamify");

const { lastRun } = JSON.parse(fs.readFileSync("config.json", "utf-8"));

const saveSpace = async (space) => {
  try {
    console.log(space.name);
    fs.writeFileSync(
      filenamify(space.name) + ".json",
      JSON.stringify(space),
      "utf-8"
    );
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
      "config.json",
      JSON.stringify({ lastRun: new Date() }, "utf8")
    );
  })
  .catch((e) => console.error(e));
