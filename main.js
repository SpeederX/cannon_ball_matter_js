function main() {
  var games = {
    flipper: startGame,
    "cannon-ball": startGame,
    "space-invaders": startGame,
  };

  var containerList = document.querySelector(".games-list");
  containerList.childNodes.forEach((element) => {
    element.addEventListener(
      "click",
      (ev) => {
        let gameSelected = ev.target.className;
        games[gameSelected]();
      },
      false
    );
  });
  startGame();
}

function startGame() {
  var containerElement = document.querySelector(".game-container");
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create();

  var renderWidth = 1366,
    renderHeight = 768;

  // create a renderer
  var render = Render.create({
    element: containerElement,
    engine: engine,
    options: {
      width: 1366,
      height: 768,
      showAngleIndicator: true,
    },
  });

  var group = Body.nextGroup(true);
  // create two boxes and a ground
  var cannon = Bodies.rectangle(150, renderHeight - 60, 150, 40, {
    collisionFilter: { group: group },
  });
  Body.setCentre(cannon, { x: -50, y: 0 }, true);
  var wheel = Bodies.circle(100, renderHeight - 60, 30, {
    collisionFilter: { group: group },
    isStatic: true,
  });
  var ground = Bodies.rectangle(
    renderWidth / 2,
    renderHeight,
    renderWidth,
    60,
    {
      isStatic: true,
    }
  );
  var leftWall = Bodies.rectangle(0, renderHeight / 2, 60, renderHeight, {
    isStatic: true,
  });
  var rightWall = Bodies.rectangle(
    renderWidth,
    renderHeight / 2,
    60,
    renderHeight,
    {
      isStatic: true,
    }
  );
  var roof = Bodies.rectangle(renderWidth / 2, 0, renderWidth, 60, {
    isStatic: true,
  });

  var constraint = Constraint.create({
    // pointA: { x: 150, y: 100 },
    bodyA: wheel,
    bodyB: cannon,
    // pointB: wheel.position,
  });
  const worldObjects = [
    wheel,
    cannon,
    ground,
    leftWall,
    rightWall,
    roof,
    constraint,
  ];
  engine.gravity.y = 1;
  // add all of the bodies to the world
  Composite.add(engine.world, worldObjects);

  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();

  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
        },
      },
    });
  Composite.add(engine.world, mouseConstraint);

  const key = {
    ArrowDown: 40,
    ArrowLeft: 37,
    ArrowRight: 39,
    ArrowUp: 38,
  };

  // run the engine
  Runner.run(runner, engine);
  var spaceCounter,
    timePressed = 0;
  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowLeft":
        Body.rotate(cannon, 0.1);
        console.log("Cannon angle", cannon.bounds);
        break;
      case "ArrowRight":
        Body.rotate(cannon, -0.1);
        console.log(cannon.axes);
        console.log(
          `Cannon: 
          angle - ${cannon.angle},
          bounds(minxy/maxxy) - [${cannon.bounds.min.x},${cannon.bounds.min.y}]
          /[${cannon.bounds.max.x},${cannon.bounds.max.y}],
          axes(x/y) - ${cannon.axes.x}/${cannon.axes},`
        );
        break;
      case "Space":
        spaceCounter = setInterval(() => {
          timePressed++;
        }, 100);

        console.log("Cannon angle", cannon.angle);
        break;
      default:
        console.log("EventCode:", event.key);
        break;
    }
    console.log(event);
  });
  document.addEventListener("keyup", (event) => {
    switch (event.code) {
      case "ArrowLeft":
        Body.rotate(cannon, 0.1);
        console.log("Cannon angle", cannon.bounds);
        break;
      case "ArrowRight":
        Body.rotate(cannon, -0.1);
        console.log(cannon.axes);
        console.log(
          `Cannon: 
          angle - ${cannon.angle},
          bounds(minxy/maxxy) - [${cannon.bounds.min.x},${cannon.bounds.min.y}]
          /[${cannon.bounds.max.x},${cannon.bounds.max.y}],
          axes(x/y) - ${cannon.axes.x}/${cannon.axes},`
        );
        break;
      case "Space":
        clearInterval(spaceCounter);
        spawnProjectile(cannon, engine, timePressed);
        timePressed = 0;
        console.log("Cannon angle", cannon.angle);
        break;
      default:
        console.log("EventCode:", event.key);
        break;
    }
    console.log(event);
  });
}
function spawnProjectile(
  spawner,
  engine,
  forceMultiplier,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composite = Matter.Composite
) {
  var projectile = Bodies.circle(spawner.position.x, spawner.position.y, 15);
  // var force = 10;
  // var deltaVector = Matter.Vector.sub(cannon.position, projectile.position);
  // var normalizedDelta = Matter.Vector.normalise(deltaVector);
  // var forceVector = Matter.Vector.mult(normalizedDelta, force);
  var force = 0.01 * forceMultiplier;
  console.log(force);
  Composite.add(engine.world, [projectile]);
  Body.applyForce(projectile, spawner.position, {
    x: Math.cos(spawner.angle) * force,
    y: Math.sin(spawner.angle) * force,
  });
}
if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {
  // `DOMContentLoaded` has already fired
  main();
}
