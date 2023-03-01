const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const boxWidth = 500;
const boxHeight = 500;
const radius = 30;
const diameter = radius * 2;
const circlesCount = 5;

class PatternCircle {
  static #patternCirclesTop = [];
  static #patternCirclesLeft = [];
  static #initialSpeed = 0;

  static getPatternCircles() {
    return [this.#patternCirclesTop, this.#patternCirclesLeft];
  }

  static initPatternCircles(count, initialSpeed) {
    if (this.#initialSpeed === 0) {
      this.#initialSpeed = initialSpeed;
    }
    if (this.#patternCirclesLeft.length === 0) {
      for (let i = 0; i < count; i++) {
        this.#patternCirclesLeft.push(
          new PatternCircle(
            radius,
            2 * diameter + (diameter + 20) * i,
            i + initialSpeed
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
  static #curvesTab = [];
  static initCurves(count) {
    for (let i = 0; i < count; i++) {
      this.#curvesTab[i] = new Array(count);
    }

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        this.#curvesTab[i][j] = new Curve();
      }
    }
  }
  static getCurves() {
    return this.#curvesTab;
  }
  x = 100;
  y = 100;
  #pathPointsTab = [];
  #pointsSkip = 5;
  #drawPath() {
    this.#pointsSkip -= 1;
    if (this.#pointsSkip <= 0) {
      this.#pathPointsTab.push({ x: this.x, y: this.y });
      this.#pointsSkip = 5;
    }
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.moveTo(this.x, this.y);
    this.#pathPointsTab.forEach(({ x, y }) => {
      ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  clearPath() {
    this.#pathPointsTab = [];
  }
  drawCurvePoint(x, y) {
    this.x = x;
    this.y = y;
    this.#drawPath();
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

//Initialization
PatternCircle.initPatternCircles(circlesCount, 0.8);
Curve.initCurves(circlesCount);

(function loop() {
  ctx.fillStyle = "rgba(50,50,50,0.5)";
  ctx.fillRect(0, 0, width, height);
  const count = PatternCircle.getPatternCircles()[0].length;
  const [CirclesTop, CirclesLeft] = PatternCircle.getPatternCircles();
  const curves = Curve.getCurves();

  for (let i = 0; i < count; i++) {
    curves[i].forEach((curve) => curve.clearPath());
  }

  for (let i = 0; i < count; i++) {
    CirclesTop[i].show();
    CirclesLeft[i].show();

    for (let j = 0; j < count; j++) {
      curves[i][j].drawCurvePoint(CirclesTop[i].x, CirclesLeft[j].y);
    }
  }

  requestAnimationFrame(loop);
})();
