var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var c = document.createElement('canvas');
var $ = c.getContext('2d');
var w = c.width = 420;
var h = c.height = 420;

document.body.appendChild(c);

var Point = function () {
    function Point(x, y, z) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    _createClass(Point, [{
        key: 'rotateX',
        value: function rotateX(amount) {
            var y = this.y;
            this.y = y * Math.cos(amount) + this.z * Math.sin(amount) * -1.0;
            this.z = y * Math.sin(amount) + this.z * Math.cos(amount);
        }
  }, {
        key: 'rotateY',
        value: function rotateY(amount) {
            var x = this.x;
            this.x = x * Math.cos(amount) + this.z * Math.sin(amount) * -1.0;
            this.z = x * Math.sin(amount) + this.z * Math.cos(amount);
        }
  }, {
        key: 'rotateZ',
        value: function rotateZ(amount) {
            var x = this.x;
            this.x = x * Math.cos(amount) + this.y * Math.sin(amount) * -1.0;
            this.y = x * Math.sin(amount) + this.y * Math.cos(amount);
        }
  }, {
        key: 'getProjection',
        value: function getProjection(distance, xy, offSet, offSetZ) {
            return distance * xy / (this.z - offSetZ) + offSet;
        }
  }, {
        key: 'draw',
        value: function draw(x, y, size, color) {
            $.save();
            $.beginPath();
            $.fillStyle = color;
            $.arc(x, y, size, 0, 2 * Math.PI, true);
            $.fill();
            $.restore();
        }
  }]);

    return Point;
}();

var Sphere = function () {
    function Sphere() {
        var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20.0;

        _classCallCheck(this, Sphere);

        this.point = [];
        this.color = "rgb(100,0,255)";
        this.radius = radius;
        this.numberOfVertexes = 0;

        this.rotation = 0;
        this.distance = 0;

        this.init();
    }

    _createClass(Sphere, [{
        key: 'init',
        value: function init() {
            for (var alpha = 0; alpha <= 6.28; alpha += 0.17) {
                var p = this.point[this.numberOfVertexes] = new Point();

                p.x = Math.cos(alpha) * this.radius;
                p.y = 0;
                p.z = Math.sin(alpha) * this.radius;

                this.numberOfVertexes++;
            }

            for (var direction = 1; direction >= -1; direction -= 2) {
                for (var beta = 0.17; beta < Math.PI; beta += 0.17) {
                    var radius = Math.cos(beta) * this.radius;
                    var fixedY = Math.sin(beta) * this.radius * direction;

                    for (var _alpha = 0; _alpha < 6.28; _alpha += 0.17) {
                        var _p = this.point[this.numberOfVertexes] = new Point();

                        _p.x = Math.cos(_alpha) * radius;
                        _p.y = fixedY;
                        _p.z = Math.sin(_alpha) * radius;

                        this.numberOfVertexes++;
                    }
                }
            }
        }
  }, {
        key: 'draw',
        value: function draw() {
            var x = void 0,
                y = void 0;
            var p = new Point();

            for (var i = 0; i < this.numberOfVertexes; i++) {
                p.x = this.point[i].x;
                p.y = this.point[i].y;
                p.z = this.point[i].z;

                p.rotateX(this.rotation);
                p.rotateY(this.rotation);
                p.rotateZ(this.rotation);

                x = p.getProjection(this.distance, p.x, w / 2.0, 100.0);
                y = p.getProjection(this.distance, p.y, h / 2.0, 100.0);

                if (x >= 0 && x < w) {
                    if (y >= 0 && y < h) {
                        if (p.z < 0) {
                            p.draw(x, y, 1, "rgba(200,200,200,0.6)");
                        } else {
                            p.draw(x, y, 1, "rgb(255,255,255)");
                        }
                    }
                }
            }
        }
  }, {
        key: 'update',
        value: function update() {
            this.rotation += Math.PI / 360.0;

            if (this.distance < 1000) {
                this.distance += 10;
            }
        }
  }]);

    return Sphere;
}();

var sphere = new Sphere();

function draw() {
    window.requestAnimationFrame(draw);

    $.save();
    $.clearRect(0, 0, w, h);

    sphere.draw();

    $.restore();

    sphere.update();
}

draw();