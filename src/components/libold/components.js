export default class Components {
    static adsr(id,height) {
      let h = (height === undefined?200:height);
      return { type: 'panel', label: 'adsr', id: id, onVal: true, widgets: [
                { id: id + '_a', type: 'fader', label: 'A', min: 0, max: 3, step: 0.01, defval: 0.01, height:h },
                { id: id + '_d', type: 'fader', label: 'D', min: 0, max: 3, step: 0.01, defval: 0, height:h },
                { id: id + '_s', type: 'fader', label: 'S', min: 0, max: 1, step: 0.01, defval: 1, height:h},
                { id: id + '_r', type: 'fader', label: 'R', min: 0, max: 1, step: 0.01, defval: 0.1, height:h },
             ]
      }
    }
}
