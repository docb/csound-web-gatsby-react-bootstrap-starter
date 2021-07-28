export default class Components {
  static adsr(id, height) {
    let h = (height === undefined ? 200 : height)
    return {
      type: "panel", label: "adsr", id: id, on: true, widgets: [
        { id: id + "_a", type: "fader", label: "A", min: 0, max: 3, step: 0.01, defval: 0.01, height: h },
        { id: id + "_d", type: "fader", label: "D", min: 0, max: 3, step: 0.01, defval: 0, height: h },
        { id: id + "_s", type: "fader", label: "S", min: 0, max: 1, step: 0.01, defval: 1, height: h },
        { id: id + "_r", type: "fader", label: "R", min: 0, max: 1, step: 0.01, defval: 0.1, height: h },
      ],
    }
  }

  static lfo(id, label, amp) {
    const size = 35
    return {
      type: "panel", label: label, id: id + "_on", on: true, defval:false, widgets: [
        {
          type: "panel", id: id + "ctrlpanel", vertical: true, widgets: [
            {
              id: id + "_rte",
              type: "knob",
              label: "rte",
              min: 0.01,
              max: 10,
              log: true,
              step: 0.01,
              defval: 0.1,
              height: size,
              width: size,
              digits: 3,
            },
            {
              id: id + "_amp",
              type: "knob",
              label: "amp",
              min: 0.0,
              max: amp || 1,
              step: 0.01,
              defval: 0,
              height: size,
              width: size,
              digits: 3,
            },
            {
              id: id + "_phs",
              type: "knob",
              label: "phs",
              min: 0.0,
              max: 1,
              step: 0.01,
              defval: 0,
              height: size,
              width: size,
            },
          ],
        },
        {
          type: "panel", id: id + "selectpanel", widgets: [
            {
              id: id + "_type", label: "type", type: "select", defval: 0, vertical: true, items: [
                { name: "sin", value: 0 },
                { name: "rndc", value: 1 },
                { name: "rnd", value: 2 },
                { name: "sqr", value: 3 },
                { name: "saw", value: 4 },
                { name: "was", value: 5 },
                { name: "adsr2", value: 6 },
              ],
            },
          ],
        },
      ],
    }

  }

}
