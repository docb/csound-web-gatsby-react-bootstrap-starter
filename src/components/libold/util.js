export default class Util {

    constructor() {
      this.sintable = new Array(65536);
      for (let i = 0; i < 65536; i++)
      {   
        this.sintable[i] = Math.sin(2*Math.PI * i/65536.0);
      }   
      this.od2p = 1/(2*Math.PI);
      this.mpih = Math.PI/2;
    }

    sin(fphs) {
      let sign = fphs>=0?1:-1;
      let phs = Math.floor(fphs*this.od2p*65536);
      return sign*this.sintable[(sign*phs)&0xFFFF];
    }
    
    cos(fphs) {
      return this.sin(this.mpih-fphs);
    }

    static randomInt() {
       return this.randomIntM(4294967296); 
    }
    static randomIntM(max) {
       return Math.floor(Math.random() * max); 
    }
}
