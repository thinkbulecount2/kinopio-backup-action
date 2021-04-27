#!/usr/bin/env node

const fs = require("fs");
const needle = require("needle");

const saveSpace = async (space) => {
  try {
    console.log(space.name);
    // fs.writeFileSync(space.name, JSON.stringify(space), "utf-8");
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
        await saveSpace(space);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

saveSpaces().catch((e) => console.error(e));
