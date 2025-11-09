let cities = [
  {name: "San Jose", x: 290, y: 445, n: 8},
  {name: "Los Angeles", x: 460, y: 630, n: 2},
  {name: "San Diego", x: 517, y: 700, n: 5}
];
let colorMap = {};
let img, table, myFont, selected = null;
let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTDeNdpBx69ZrLBmJupfm6j2vniuh6ycCXqqfjIrevlV2hJB8-O3S73a38IYxphYa-EwagEISXEutzj/pub?gid=0&single=true&output=csv";

function preload() {
  img = loadImage("CalMap.png");
  table = loadTable(url, "csv", "header");
  myFont = loadFont("Pacifico.ttf");
}

function setup() {
  let canvas = createCanvas(1000, 800);     
  canvas.position((windowWidth - width) / 2, 40); 
  imageMode(CENTER); 
  textAlign(CENTER);
  
  let names = [];
  for (let r = 0; r < table.getRowCount(); r++) {
    names.push(table.getRow(r).getString("shelter_name"));
  }
  let unique = [...new Set(names)];
  for (let i = 0; i < unique.length; i++) {
    const h = (i * 360 / unique.length) % 360; 
    colorMap[unique[i]] = color(`hsl(${h}, 70%, 50%)`);
  }
}

function draw() {
  background(242, 240, 235);
  image(img, 410, 450, 535, 612);

  let hovered = null;
  for (let c of cities)
    if (dist(mouseX, mouseY, c.x, c.y) < 15 ||
        (mouseX > c.x && mouseX < c.x + 200 && abs(mouseY - c.y) < 30))
      hovered = c;

  stroke(0); 
  strokeWeight(3); 
  fill(255);
  for (let c of cities)
  ellipse(c.x, c.y, hovered === c ? 30 : 20);

  noStroke(); 
  fill(0); 
  textSize(30); 
  textAlign(LEFT, CENTER);
  for (let c of cities) text(c.name, c.x - 150, c.y + 30);

if (hovered) {
  for (let i = 0; i < hovered.n; i++) {
    const cx = hovered.x + 30 + i * 20;
    const cy = hovered.y;
   
    const row  = table.getRow(i); 
    const name = row ? row.getString("shelter_name") : `${hovered.name}-${i+1}`;
    const btnColor = colorFromName(name);

    const isSel = selected && selected.city === hovered.name && selected.index === i;

    stroke(0);
    strokeWeight(isSel ? 3 : 1.5);
    fill(btnColor);
    ellipse(cx, cy, 15, 15);

    if (isSel) {
      noFill();
      stroke(0);
      strokeWeight(3);
      ellipse(cx, cy, 19, 19);
      drawBox(cx, cy, i);
    }
  }
}

  fill(120, 81, 169); 
  noStroke(); 
  textSize(48); 
  textFont(myFont);  
  textAlign(CENTER);
  text("Homeless Shelter & Gender", width / 2,15 );
  
  textSize(23); 
  textFont("sans-serif"); 
  textWrap(WORD); 
  textAlign(RIGHT);
  text("This project presents the spatial, temporal, and gender-based distribution and disparities of shelter institutions within California’s shelter system across three cities from 2023 to 2025.", 100, 120,800); 
  textAlign(LEFT);
  text("Hover over the city and click on the small circles to view detailed information about each shelter.", 500, 250,300);
}

function mousePressed() {
  for (let c of cities) {
    for (let i = 0; i < c.n; i++) {
      const cx = c.x + 30 + i * 20, cy = c.y;
      if (dist(mouseX, mouseY, cx, cy) < 6)
        return (selected = {city: c.name, index: i});
    }
  }
  selected = null;
}

function drawBox(x, y, i) {
  push();
  const w = 240, h = 120;
  let bx = x + 15, by = y - h - 10;
  if (by < 20) by = y + 15;

  stroke(0); 
  strokeWeight(2); 
  fill(255); 
  rect(bx, by, w, h, 8);

  const row = table.getRow(i);
  let name   = row.getString("shelter_name");
  let year   = row.getString("year");
  let season = row.getString("season");
  let female = row.getString("female_percentage");

  noStroke(); 
  fill(0); 
  textSize(17);
  textAlign(LEFT, TOP);
  text(`Shelter: ${name}\nYear: ${year}\nSeason: ${season}`, bx + 10, by + 10);

  textStyle(BOLD);
  textSize(22);
  fill(120, 81, 169);  
  textAlign(CENTER, CENTER);
  text(`Female: ${female}`, bx + w / 2, by + h - 25); 

  pop();
}

function colorFromName(name) {
  if (colorMap[name]) return colorMap[name];   
  const h = nameToHue(name);
  return color(`hsl(${h}, 70%, 50%)`);
}


