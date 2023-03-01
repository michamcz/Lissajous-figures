const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const boxWidth = 500;
const boxHeight = 500;
const radius = 30;
const diameter = radius * 2;
const circlesCount = 10;

class LissajousCollection {

  #patternCirclesTop = [];
  #patternCirclesLeft = [];
  #curvesTab = [];

  initPatternCircles(count, initialSpeed = 1) {
    if (this.#patternCirclesLeft.length === 0) {
      for (let i = 0; i < count; i++) {
        this.#patternCirclesLeft.push(
          new PatternCircle(
            radius,
            2 * diameter + (diameter + 20) * i,
            i * initialSpeed + initialSpeed
          )
        );
        this.#patternCirclesTop.push(
          new PatternCircle(
            2 * diameter + (diameter + 20) * i,
            radius,
            i + initialSpeed
          )
        );
      }
    }
  }

  getPatternCircles() {
    return [this.#patternCirclesTop, this.#patternCirclesLeft];
  }

  initCurves(count) {
    for (let i = 0; i < count; i++) {
      this.#curvesTab[i] = new Array(count);
    }

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        this.#curvesTab[i][j] = new Curve();
      }
    }
  }

  getCurves() {
    return this.#curvesTab;
  }
}

class PatternCircle {
  x = 0;
  y = 0;
  angle = Math.PI / 2;

  constructor(xCenter, yCenter, speed) {
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.speed = speed;
  }

  #drawTrail() {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.arc(this.xCenter, this.yCenter, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  #updatePoint() {
    this.x =
      this.xCenter + radius * Math.sin((this.angle -= 0.01 * this.speed));
    this.y =
      this.yCenter + radius * Math.cos((this.angle -= 0.01 * this.speed));
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  show() {
    this.#drawTrail();
    this.#updatePoint();
  }
}

class Curve {
  x = 100;
  y = 100;
  angle = 0;
  #pathPointsTab = [];
  #pointsSkip = 5;

  #drawPath() {
    this.angle += 0.02;
    this.#pointsSkip -= 1;
    if (this.#pointsSkip <= 0) {
      this.#pathPointsTab.push({ x: this.x, y: this.y });
      this.#pointsSkip = 1;
    }
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    this.#pathPointsTab.forEach(({ x, y }) => {
      ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  #clearPath() {
    this.angle = 0;
    this.#pathPointsTab = [];
  }

  drawCurvePoint(x, y) {
    this.x = x;
    this.y = y;
    if (this.angle >= 2 * Math.PI) {
      this.#clearPath();
    }
    else this.#drawPath();
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

//Initialization
const Lissajous = new LissajousCollection();
Lissajous.initPatternCircles(circlesCount, 1);
Lissajous.initCurves(circlesCount);

(function loop() {
  ctx.fillStyle = "rgba(50,50,50,0.5)";
  ctx.fillRect(0, 0, width, height);
  const count = Lissajous.getPatternCircles()[0].length;
  const [CirclesTop, CirclesLeft] = Lissajous.getPatternCircles();
  const curves = Lissajous.getCurves();

  for (let i = 0; i < count; i++) {
    CirclesTop[i].show();
    CirclesLeft[i].show();

    for (let j = 0; j < count; j++) {
      curves[i][j].drawCurvePoint(CirclesTop[i].x, CirclesLeft[j].y);
    }
  }
  requestAnimationFrame(loop);
})();
