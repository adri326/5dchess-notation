import {Game, Timeline} from "./game.js";

export function parse(raw) {
  let deserialized = JSON.parse(raw);
  let g = new Game(1, 1, [0]);
  for (let key in deserialized) {
    if (key === "timelines") {
      g.timelines = deserialized.timelines.map(tl => {
        let timeline = new Timeline(1, 1, 0);
        for (let key in tl) {
          timeline[key] = tl[key];
        }
        return timeline;
      });
    } else {
      g[key] = deserialized[key];
    }
  }
  return g;
}
