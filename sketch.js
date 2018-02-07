var faded_en = 0;
var faded_it = 145;
var radarOn=false;
var eng=true;
var ita=false;
var transTime=150;
var rot=0;
var climbOn=false;
var backMenu=false;
var colorList = ['#9FD3D6','#EAEEEF','#F48021','#F29C4E','#FAFAFB','#488282']; //159,211,214 (0-bg), 234,238,239 (1-button), 244,128,33 (2-textOrange), 242,156,78 (3-textOrange2),250,250,251(4-buttonPressed),72,130,130 (5-darkBlue)
var titleScreenOn = true;
var infoOn=false;
var infoButtonShow=false;
var instOn=true;
var c=-150;
var sequoiaDemoOn=false;
var burjDemoOn=false;
var demoTitlesOn=false;

var check_scal=false; //la scalata è iniziata, si può iniziare il conteggio dei metri
var scelto=-1;//id globale dell'edificio scelto
var head_scal=null; //heading durante la scalata
var conta_head=0; // assestamento heading scalata

var myData, //segnaposto JSON

    posRelMe = [], //Oggetto Posizioni oggetti rispetto alla mia posizione
    myLat, //mia posizione Lat (Se si vuole mettere una fittizia, aggiungerla qui e disattivare getLocationUpdate() nel setup()) [Esempio: 45.504996]
    myLon, //mia posizione Lon (Se si vuole mettere una fittizia, aggiungerla qui e disattivare getLocationUpdate() nel setup()) [Esempio: 9.166526]
    heading, //mia direzione
    heading_tot=0, //direzione salvata in caso di Nan
    posXPointer, //posizione centro radar
    posYPointer, //posizione centro radar

    zoom = 70000; //var zoom inizilae
    limSupZoom = 1364;
    limInfZoom = 91072;
    zoomIncrement = 1.04;

    distCliccable = 12000; //distanza dalla cui si può selezionare (in metri)

    nordIsUp = true;

    imgLinkGray = [];
    imgLinkColore = [];
    imgLinkBack = [];
    imgLink = [];
    nameLink_en = [];
    descLink_en = [];
    nameLink_it = [];
    descLink_it = [];

    heightLink = [];

    hit_struct = [];

    //variabili scalata+geolocalizzazione

var accuracy,

    numeroAgg = -1,
    metriTOT = 0,
    metriPrec = 0,
    veli = 0,
    tempo = 0,
    backUpPositionLat = [],
    backUpPositionLon = [],
    backUpPositionDist = [],

    stabilizzato = true, //inizia con la propriteà non stabilizzata
    backUpstabilizzation = [], //crea la array dei valori per stabilizzare
    stabilizzationTOT = 0,
    accuracyLimit = 0.4, //valore in metri che deve avere la sommatoria della array precedente per essere considerata accettabile
    maxStabilizzationArray = 4, //massimo numero di valori che l'array di sopra può tenere (maggiore è più preciso è)

    conv=0, //conversione da m in pixel di scalata

    imgMask,

    position,
    geoLoc;

function preload() { //tutti i preload delle immagini e i font
  console.time('preload');
  ubuntuMedium=loadFont('./fonts/Ubuntu-M.ttf');
  ubuntuMediumItalic=loadFont('./fonts/Ubuntu-MI.ttf');
  ubuntuBold=loadFont('./fonts/Ubuntu-B.ttf');
  ubuntuBoldItalic=loadFont('./fonts/Ubuntu-BI.ttf');
  ubuntuRegular=loadFont('./fonts/Ubuntu-R.ttf');
  ubuntuRegularItalic=loadFont('./fonts/Ubuntu-RI.ttf');
  flag_en = loadImage('./assets/lang_en.png');
  flag_it = loadImage('./assets/lang_it.png');
  sequoia_button = loadImage('./assets/sequoia_button.png');
  burijKalifa_button = loadImage('./assets/burijKalifa_button.png');
  cloud = loadImage('./assets/cloud.png');
  infoButtonIco = loadImage('./assets/infoButtonIco.png');
  SU_logo = loadImage('./assets/SU_logo.png');
  camminaIco = loadImage('./assets/camminaIco.png');
  drittoIco = loadImage('./assets/drittoIco.png');
  nuclearTriad = loadImage('./assets/nuclearTriad.png');

  myData = loadJSON('./assets/heights.json');

    console.timeEnd('preload');
}

function setup() { //tutti i default dell'interfaccia
  imgClone  = createGraphics(720, 1280);


  createCanvas(innerWidth,innerHeight);
  mask = createGraphics(width,height); //crea il segnaposto per la mascherma sotto (le grandezze qui si ripetono poi sotto)
  rectMode(CENTER);
  textAlign(CENTER);
  angleMode(DEGREES);
  textFont(ubuntuMediumItalic);

  getLocationUpdate()
  calcPosRelMe()

  for (var i=0; i < myData.landmarks_en.length; i++) {
    imgLinkGray.push("assets/"+myData.landmarks_en[i].img_gray);
    imgLinkColore.push("assets/"+myData.landmarks_en[i].img_color);
    imgLinkBack.push("assets/"+myData.landmarks_en[i].img_back);
    imgLink.push("assets/"+myData.landmarks_en[i].img);
    imgLinkGray[i] = loadImage(imgLinkGray[i]);
    imgLinkColore[i] = loadImage(imgLinkColore[i]);
    imgLinkBack[i] = loadImage(imgLinkBack[i]);
    imgLink[i] = loadImage(imgLink[i]);

    nameLink_en.push(myData.landmarks_en[i].name);
    descLink_en.push(myData.landmarks_en[i].Description);

    nameLink_it.push(myData.landmarks_it[i].name);
    descLink_it.push(myData.landmarks_it[i].Description);

    heightLink.push(myData.landmarks_en[i].height);
    }
  }

function draw() {
  if(mouseIsPressed==false) {mouseX=-100; mouseY=-100;}

  translate(width/2,height/2);

  if(windowWidth>windowHeight){
    background(colorList[0]);
    textSize(16);
    fill(25);
    text("This site is intended to be viewed on a smartphone in portrait mode",0,height/2.4,width-210,height/3);
    imageMode(CENTER);
    scale(0.45);
    image(SU_logo,0,-height/4.5);
  }
  else{
  background(colorList[0]);
  // instructions();
  // infoOn=true;
  // infoOpen=true;
  // infoButtonShow=true;
  // climbMode(7,true,1.25,1.25,-700,200);
  // demoTitles();
  // radar();
  // titleScreenOn=false;
  if(titleScreenOn==true) {
    titleScreen();
  };

  if(radarOn==true){
    if(instOn==true) {
      instructions();
    }
    else{radar();}

  };

  if(demoTitlesOn==true){
    if(instOn==true) {
      instructions();
    }
    else{demoTitles();}
  };

  if(sequoiaDemoOn==true) { //avvia la modalità scalata (climbOn viene impostato come true solo dopo la pressione del pulsante della squoia, per ora)
    //check_scal=true;
    scelto=8;
    climbMode(8,true,1.25,1.25,-700,200); //structNum,cloudBool,cloudX,cloudY,cloudMin,cloudMax
  };

  if(burjDemoOn==true) { //avvia la modalità scalata (climbOn viene impostato come true solo dopo la pressione del pulsante della squoia, per ora)
    //check_scal=true;
    scelto=9;
    climbMode(9,true,15,2,-550,400); //structNum,cloudBool,cloudX,cloudY,cloudMin,cloudMax
  };

  for (var i=0; i < myData.landmarks_en.length; i++){
      if((hit_struct[i]==true)&&(posRelMe[i].dist<=distCliccable)){
          //check_scal=true;
          radarOn=false;
          console.log("cliccato "+i);
          push();
          //translate(0,-posYPointer) //counter posYPointer
          scelto=i;
          climbMode(i,true,2,1.25,-700,200); //structNum,cloudBool,cloudX,cloudY,cloudMin,cloudMax
          pop();
        };
    };

if(backMenu==true) { //se true fa comparire il menu per tornare indietro
  bMenu();
}
  push(); // debug
  /*
  translate(-width/2,-height/2);
  textAlign(LEFT);
  textSize(12);
  textFont(ubuntuRegular);
  text('latitude: ' + myLat, 5, 30);
  text('longitude: ' + myLon, 5, 30 * 2);
  text('stabile: ' + stabilizzato + "/" + climbOn + "/" + check_scal, 5, 30 * 3);
  text('accuracy: ' + accuracy, 5, 30 * 4);
  text('Aggiornamenti: ' + numeroAgg, 5, 30 * 5);
  text('Distanza Precedente: ' + metriPrec, 5, 30 * 6);
  text('conv: ' + conv, 5, 30 * 7);
  text('heading: ' + heading, 5, 30 * 8);
  text('versione 12:48 5/02/18', 5, 30 * 9);
  */
  pop();
  // console.log('infoOn: '+infoOn);
  // console.log('infoButtonShow: '+infoButtonShow);
  }
} //draw END

function titleScreen() {
  if(eng==true) {var creditText = "credits";}
  if(ita==true) {var creditText = "crediti";}
  titleScreenOn = true; //ogni schermata mette se stessa come true e le altre come false
  climbOn=false;
  c+=0.1;
  if(c>400) {c=-400};
  push();
  background(159,211,214);

  push();
  scale(0.5);
  image(cloud,c,height/15);
  pop();

  push();
  imageMode(CENTER);
  scale(0.85);
  image(SU_logo,0,-height/6);
  pop();

  rectMode(CENTER); //localmente testi e rettangoli vengono messi in rectMode(CENTER) per comodità
  textAlign(CENTER);
  startButton('start');
  demoButton('demo');
  flag_ita(faded_it);
  flag_eng(faded_en);

  push();
  var hit_cred = false;
  textAlign(LEFT);
  fill(79,86,106);
  textSize(12);
  text(creditText,-width/2.3,height/2.1);
  // stroke(79,86,106);
  // strokeWeight(1);
  // line(-width/2.3,height/2.08,-width/3,height/2.08);
  // noFill();
  // stroke(255);
  // strokeWeight(1);
  // rectMode(CORNER);
  // rect(-width/2.1,height/2.25,65,30);
  hit_cred = collidePointRect(mouseX-width/2,mouseY-height/2,-width/2.1,height/2.35,65,35);
  if(hit_cred==true) {
    push();
    background(245);
    imageMode(CENTER);
    push();
    textAlign(CENTER);
    text("We'll hack your location and then we'll nuke your home.",0,height/2.4,width-50,height/3);
    pop();
    scale(0.7);
    image(nuclearTriad,0,-height/10);
    pop();
  }
  pop();

  pop();
}

function backArrow() {
  var posX=-width/2.15
  var posY=-height/2.25
  var hit_back=false;
  push();
  noFill();
  stroke(45,45,45,90);
  strokeWeight(5);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  beginShape();
  vertex(posX+9,posY-9);
  vertex(posX,posY);
  vertex(posX+9,posY+9);
  endShape();
  push();
  rectMode(CORNER); //attiva il codice commentato sottostante per mostrare la posizione dell'area di collisione
  // stroke(255);
  // strokeWeight(1);
  // rect(-width/2.15-12,-height/2.25-27,40,52);
  hit_back = collidePointRect(mouseX-width/2,mouseY-height/2,-width/2.15-12,-height/2.25-27,40,52); //funzione di collide2D.p5
  if(hit_back==true) { //effetti della collisione

      if(demoTitlesOn==true && climbOn==false || radarOn==true){ //se il pulsante si trova nel menu della demo o nel radar si torna al titleScreen
      demoTitlesOn=false;
      titleScreenOn=true;
      radarOn=false;
      setTimeout(function() {r=65},200);
      hit_back=false;
    };

    if(climbOn==true) { //se il pulsante si trova nella schermata della scalata attiva il menu per tornare indietro
    backMenu=true;
  }

}
pop();
pop();
  }


var r = 65;

function demoTitles(){
  titleScreenOn = false;
  radarOn=false;
  infoOn=false;
  backMenu=false;
  climbOn=false;
  no_hype=true;
  var hyperionTitle;
  var hit_hyperion=false;
  var hit_burj=false;
  if(eng==true) {hyperionTitle="Redwood Hyperion"};
  if(ita==true) {hyperionTitle="Sequoia Hyperion"};
  push();
  textAlign(CENTER);
  backArrow();

  textSize(52);
  fill(89,210,220,150);
  text('demo',0+2,-height/3.2+2);
  fill(colorList[3]);
  text('demo',0,-height/3.2);
  noStroke();

  fill(45,45,45,45);
  rect(0+1,-height/10+1,312,138,3); //drop shadow

  fill(colorList[1]);
  rect(0,-height/10,312,138,3); //sequoia button

  fill(45,45,45,45);
  rect(0+1,-height/10+160+1,312,138,3); //drop-shadow

  fill(colorList[1]);
  rect(0,-height/10+160,312,138,3); //burj button

  imageMode(CENTER);
  textAlign(LEFT);
  fill(45,45,45);
  textSize(28);
  textFont(ubuntuMedium);
  text(hyperionTitle, width/11,-height/21+height/60,width/3,height/4);
  text('Burj Khalifa',width/11,-height/21+160+height/60,width/3,height/4);
  push();
  scale(0.68);
  image(sequoia_button,-width/8-100,-height/7.25);
  pop();

  push();
  scale(0.75);
  image(burijKalifa_button,-width/12-100,-height/7.4+211);

  push();
  noFill();
  rectMode(CORNER); //attiva il codice commentato sottostante per mostrare la posizione dell'area di collisione
  // stroke(45);
  // strokeWeight(1);
  // rect(-width/2.3,-height/4.2,width/1.15,height/3.65);
  hit_hyperion = collidePointRect(mouseX-width/2,mouseY-height/2,-width/2.3,-height/4.2,width/1.15,height/3.65);
  if(hit_hyperion==true) {
    fill(colorList[4]);
    // climbMode(sequoia_bg,sequoia,50,true,2,1.25,-700,200);
    sequoiaDemoOn=true;
    // infoOpen=false;
    hit_hyperion=false;
  };
  pop();

  hit_burj = collidePointRect(mouseX-width/2,mouseY-height/2,-width/2.3,height/13,width/1.15,height/3.65);
  if(hit_burj==true) {
    fill(colorList[4]);
    // climbMode(sequoia_bg,sequoia,50,true,2,1.25,-700,200);
    burjDemoOn=true;
    // infoOpen=false;
    hit_burj=false;
  };
  pop();

// console.log(hit_hyperion);
// console.log(hit_burj);

  pop();
}
var f=300;
function climbMode(structNum,cloudBool,cloudX,cloudY,cloudMin,cloudMax) { //structNum,cloudBool,cloudX,cloudY,cloudMin,cloudMax
  radarOn=false;
  climbOn=true;
  check_scal=true;


  if(f>1800){f=1800} else{f+=50;}
  if(f>1000){
    demoTitlesOn=false;
    background(colorList[0]);
    climbStructure(structNum,cloudBool,cloudX,cloudY,cloudMin,cloudMax);
    climbInterface(structNum);
    backArrow();
    if(metriTOT==heightLink[structNum]){
        completed();
    }
      if(infoOn==true) { //se true fa comparire la schermata con le informazioni sulla struttura
        setTimeout(infoScreen(structNum),400);
        if(infoButtonShow==true){infoButton()};
      }
  };
  push();
  rectMode(CORNER);
  fill(colorList[0]);
  noStroke();

  //rect(width,height-f,-width*2,800);
  pop();


};

function climbInterface(structNum) {

  textAlign(CENTER);
  push();
  translate(0,-height/2);
  //translate(0,-height/2.6);
  textFont(ubuntuBoldItalic);
  textSize(40);
  fill(colorList[5]);
  text(Math.round(metriTOT*10)/10+'m',0,height/10,width,50);
  if(head_scal!=null){ //controllo heading scalata
      if(head_scal>heading_tot+(accuracy*3) || head_scal<heading_tot-(accuracy*3)){
          textSize(12);
          if(ita==true){
            text("Per una migliore esperienza è consigliato camminare in linea retta!",0,(height/7)+50,width/1.3,100);
          }
          if(eng==true){
            text("For a better experince in suggested to walk straight!",0,(height/7)+50,width/1.3,100);
          }
      }
  }
  pop();
}
var cloudSwitch=false;
function climbStructure(structNum,cloudBool,cloudX,cloudY,cloudMin,cloudMax) {
  push();
  translate(-width/2,-height/2);
  imageMode(CORNER);

  cloudSwitch=cloudBool;

  if(cloudSwitch==true) {
  //cloud
  push();
  c+=0.1;
  if(c>cloudMax) {c=cloudMin};
  scale(0.5);
  //image(cloud,width/cloudX+c,-height/cloudY);
  pop();
  }

  //background
  push();

  image(imgLinkBack[structNum],0,height-(width*(1280/720)),width,width*(1280/720));
  pop();

  //structure
  push();
  rectMode(CORNER);
  //mask.rect(((width-((height-height/11)/(1280/720)))/2), (height-height/11), ((height-height/11)/(1280/720)), (height-height/11)-conv);
  mask.rect(0,height-Math.round(map(conv,0,(height-height/10),0,height)),width,Math.round(map(conv,0,(height-height/10),0,height)));//crea maschera da rettangolo
  //mask.rect(0,height-conv,width,conv);//crea maschera da rettangolo
  image(imgClone, (width-((height-height/10)/(1280/720)))/2,height/10,(height-height/10)/(1280/720),(height-height/10));

  rectMode(CENTER);
  pop();

  pop();
};
var movY=0;
var movSwitcher=false;

function completed() {
  push();
  var txtCompleted;
  check_scal=false;
  if(movSwitcher==false) {
    if(movY<80){movY+=2};
    if(movY>=80){movY=80; movSwitcher=true;};
  }
    if(movSwitcher==true) {
      movY-=2;
      if(movY<=0) {
        movY=0;
        infoOn=true;
      };
    }
  // console.log(movY);
  if(eng==true) {txtCompleted="completed!"}
  if(ita==true) {txtCompleted="completata!"}
  textSize(46);
  textFont(ubuntuBold);

  push();
  noStroke();
  fill(45,45,45,45);
  rect(0,-height/movY+10,width+100,height/4);
  fill(245,245,245,205);
  rect(0,-height/movY+8,width+100,height/4);
  pop();
  fill(45,45,45,45);
  text(txtCompleted,0+2,height/movY+2);
  fill(colorList[3]);
  text(txtCompleted,0,height/movY);
  pop();
  pop();
}

var infoOpen=true;

function infoScreen(structNum) {
  if(infoOpen==true){
  var hit_infoOk=false;
  if(eng==true){
    var infoTxt=descLink_en[structNum];
    var structName=nameLink_en[structNum];
  }
  if(ita==true){
    var infoTxt=descLink_it[structNum];
    var structName=nameLink_it[structNum];
  }
  push();

  textFont(ubuntuBold);
  noStroke();
  fill(45,45,45,45);
  rect(0+2,-height/3+110+2,width/1.1,250,3);
  fill(colorList[1]);
  rect(0,-height/3+110,width/1.1,250,3);
  fill(45,45,45,175);
  textSize(14);
  textAlign(LEFT);
  text(infoTxt,0,-height/120+20,width/1.3,height/2);
  textSize(26);
  fill(45,45,45,185);
  text(structName,0,-height/120,width/1.3,height/1.7);

  push();
  noFill();
  stroke(45,45,45,45);
  strokeWeight(3);
  rect(0,-height/3+180,width/5,45,3);
  pop();

  push();
  fill(45,45,45,125);
  textSize(21);
  textAlign(CENTER);
  noStroke();
  text('ok',0,-height/3+186);

  rectMode(CORNER); //attiva il codice commentato sottostante per mostrare la posizione dell'area di collisione
  // stroke(255);
  // strokeWeight(1);
  // rect(-width/8.5,-height/3+155,width/4.3,50);
  hit_infoOk = collidePointRect(mouseX-width/2,mouseY-height/2,-width/8.5,-height/3+155,width/4.3,50); //funzione di collide2D.p5
  if(hit_infoOk==true) {
    infoOpen=false;
    infoButtonShow=true;
    hit_infoOk=false;
  } //effetti della collisione


  pop();

  pop();
}
}

function infoButton() {
  var hit_infoButton=false;
  push();

  push();
  imageMode(CENTER);
  image(infoButtonIco,width/2.5,height/2.4);
  pop();

  // fill('red');
  // ellipse(width/2.5,height/2.4,width/10);

  hit_infoButton=collidePointCircle(mouseX-width/2,mouseY-height/2,width/2.5,height/2.4,width/10);
  if(hit_infoButton==true) {
    infoOpen=true;
    hit_infoButton=false;
  }
  pop();

}

function instructions() {


  titleScreenOn = false;

  if(eng==true) {
    var topText="The human mind perceives distance and height in different ways.",
        questText="What happens if vertical becomes horizontal?",
        titleText="Instructions";
        camminaText="Choose one of the landmarks, stand still for a moment and begin to walk. Stop when you've completed the whole height.";
        drittoText="Tip: walk straight for the best experience.";

        if(stabilizzato==false) {stabileText="Stabilization in progress! Stand still for a moment..."}
        else{stabileText=""};
  }
  if(ita==true) {
    var topText="La mente umana percepisce l'altezza e la distanza in modo differente.",
        questText="Cosa succede se il verticale diventa orizzontale?",
        titleText="Istruzioni",
        camminaText="Scegli uno dei punti di interesse, fermati qualche istante e inizia a camminare. Fermati quando avrai completato l'intera altezza.",
        drittoText="Suggerimento: per un'esperienza migliore cammina in linea retta.";

    if(stabilizzato==false) {stabileText="Stabilizzazione in corso! Resta fermo un attimo..."}
    else{stabileText=""};
  }

  //icons
  push();
  imageMode(CENTER);
  background(colorList[0]);
  image(camminaIco,-width/3.,height/240);
  image(drittoIco,-width/3,height/240+108);
  pop();

  //text
  push();
  textSize(width/20);
  textAlign(LEFT);
  textFont(ubuntuMedium);
  fill(224,108,13);
  text(topText,0,-height/3,width-45,height/5);
  textFont(ubuntuBoldItalic);
  textSize(width/17);
  text(titleText,0,-height/20,width-45,height/5);

  fill(110,110,110);
  textSize(width/20);
  textFont(ubuntuRegularItalic);
  text(questText,0,-height/4.8,width-45,height/5);

  fill(110,110,100);
  textSize(width/28);
  textFont(ubuntuMedium);
  text(camminaText,width/12,height/18,width-150,height/5);
  text(drittoText,width/12,height/18+110,width-150,height/5);

  push();
  textAlign(CENTER);
  fill(70,100,210);
  textSize(14);
  if(height<=435) {
    textSize(12);
  }
  textFont(ubuntuBold);
  text(stabileText,0,height/2.15,200,height/5);
  pop();

  pop();
  if(stabilizzato==true) {
  instButtonStart();
  }
}

function instButtonStart() {
  if(ita==true) {var buttonText="inizia";}
  if(eng==true) {var buttonText="start";}
  //Button
  var hitInstStart=false;
  push();
  rectMode(CENTER);
  noStroke();
  fill(45,45,45,45);
  rect(0+1,height/2.6+1,120,40,4);
  fill(colorList[1]);
  rect(0,height/2.6,120,40,4);
  fill(110,110,110);
  textSize(23);
  textAlign(CENTER);
  text(buttonText,0,height/2.51)
  pop();

  push();
  rectMode(CORNER);
  // stroke(255);
  // noFill();
  // rect(-62,height/2.9,123,40);
  hit_instStart=collidePointRect(mouseX-width/2,mouseY-height/2,-62,height/2.9,123,40);
  if(hit_instStart==true) {
    calcPosRelMe();
    instOn=false;
    hit_instStart=false;
  }
  pop();
  }
var headingMode=heading_tot;
function radar() {
  var accuracyCircle=accuracy;
  var accuracyCircleCol=colorList[1];
  backMenuOn=false;
  infoOn=false;
  titleScreenOn = false;
  demoTitlesOn==false;
  climbOn=false;
  radarQuadrant();


  var locationTitle;
  var locationTxt;
  var signalTitle;
  if(eng==true) {locationTitle='location'; locationTxt='Milan'; signalTitle='signal accuracy'};
  if(ita==true) {locationTitle='luogo'; locationTxt='Milano'; signalTitle='accuratezza segnale'};

  push();
  if(accuracy>12) {accuracyCircle=12}
  if(accuracy<=4) {accuracyCircleCol='#ccfbff'}
  noFill();
  strokeWeight(3);
  stroke(104,222,232,45);
  ellipse(width/2.35-7,-height/2.16+57+1,2+accuracyCircle);
  stroke(accuracyCircleCol);
  ellipse(width/2.35-8,-height/2.16+57,2+accuracyCircle);
  fill(79,86,106);
  noStroke();
  textSize(10);
  text(signalTitle,width/2.35-23,-height/2.16+60);
  pop();

  fill(72,130,130);
  textSize(12);
  textAlign(RIGHT);
  push();
  text(locationTitle,width/2.35,-height/2.2);
  pop();
  fill(69,76,96);
  textSize(43);
  text(locationTxt,width/2.3,-height/2.2+40);
  backArrow(); //posX, posY
  push();
  // infoPoint(50,10);
  pop();
  rot+=0.01;

  if (nordIsUp==true) {headingMode=heading_tot;}  //rotation, parametro da collegare all'heading se decidiamo di far muovere il puntatore e non il radar
  else {headingMode=0;};

  drawIconOnRadar()
  zoomButtons();
  nButton();
  pointerIcon(headingMode); //rotation, parametro da collegare all'heading se decidiamo di far muovere il puntatore e non il radar

  function zoomButtons() {
    push();
    var hit_zoomMinus=false;
    fill(45,45,45,45);
    ellipse(-width/2.35+1,-height/3.7+1,38.3);
    fill(245,245,245);
    stroke(220,220,220);
    strokeWeight(2);
    ellipse(-width/2.35,-height/3.7,35);
    textAlign(CENTER);
    textFont(ubuntuRegular);
    textSize(32);
    noStroke();
    fill(175,175,175);
    text('-',-width/2.35,-height/3.7+10);
    // stroke(45);
    // noFill();
    // ellipse(-width/2.35,-height/5.2,35);
    hit_zoomMinus=collidePointCircle(mouseX-width/2,mouseY-height/2,-width/2.35,-height/3.7,35);
    if(hit_zoomMinus==true) {
      // console.log('-: '+hit_zoomMinus);
      zoomOut();
    }
    pop();

    push();
    var hit_zoomPlus=false;
    fill(45,45,45,45);
    ellipse(-width/3.4+1,-height/3+1,38.3);
    fill(245,245,245);
    stroke(220,220,220);
    strokeWeight(2);
    ellipse(-width/3.4,-height/3,35);
    textAlign(CENTER);
    textFont(ubuntuRegular);
    noStroke();
    fill(175,175,175);
    textSize(32);
    text('+',-width/3.4,-height/3+9);
    hit_zoomPlus=collidePointCircle(mouseX-width/2,mouseY-height/2,-width/3.4,-height/3,35);
    if(hit_zoomPlus==true) {
      // console.log('+: '+hit_zoomPlus);
      zoomIn();
    }
    pop();
  }

  function nButton() {
    var hit_nButton=false;
    push();
    fill(45,45,45,45);
    ellipse(-width/2.3+1,height/2.3+1,30);
    fill(colorList[1]);
    ellipse(-width/2.3,height/2.3,30);
    textAlign(CENTER);
    fill(69,190,200);
    if(nordIsUp==true) {fill(120,120,120);}
    textFont(ubuntuBold);
    textSize(12);
    triangle(-width/2.3-3,height/2.33,-width/2.3+3,height/2.33,-width/2.3,height/2.33-5);
    text("N",-width/2.3,height/2.22);
    hit_nButton=collidePointCircle(mouseX-width/2,mouseY-height/2,-width/2.2,height/2.3,30);
    if(hit_nButton==true) {
        nordIsUp=!nordIsUp;
        calcPosRelMe();
        if(mouseIsPressed==true) {mouseX=-100; mouseY=-100;}
    }
    // console.log(nordIsUp);
    pop();
  }

  function pointerIcon(rotation) { //funzione che disegna il puntatore
    push();
    fill(63,169,245);
    ellipse(0,height/11,20,20);
    translate(0,height/11);

    rotate(rotation-180);
    // rect(0,height/45,20,20);
    triangle(-9.5,height/123,9.5,height/123,0,height/123+16);
    pop();
  }

  function radarQuadrant() { //disegna il quadrante del radar. da valutare se utilizzare valori assoluti per facilitare la gestione con le coordinate GPS
    var rSignal=350;
    var rOp=90;
    var radarQuadrantSwitch=false;
    if(radarOn==true) {radarQuadrantSwitch=true;}
    if (radarQuadrantSwitch==true) {r-=23}
    if (r<=0) {r=0};

    zoomCircle = map (zoom,limSupZoom,limInfZoom,2.7,187.2);
    circleMassimo = (70+width);


  noStroke();
  fill(45,45,45,45);
  fill(45,45,45,45);
  ellipse(0,height/11,circleMassimo+2-r); //drop-shadow
  fill(245,245,245);
  ellipse(0,height/11,circleMassimo-r);
  fill(240,240,240);
  ellipse(0,height/11,zoomCircle+(circleMassimo-zoomCircle)*(2/3)-r);
  fill(235,235,235);
  ellipse(0,height/11,zoomCircle+(circleMassimo-zoomCircle)*(1/3)-r);
  fill(123,206,239,rOp);
  ellipse(0,height/11,zoomCircle-r);
  fill(235,235,235);
  ellipse(0,height/11,70+270-367-r);
  }
}

function startButton(txtLabel) {
  var hit_start = false;
  noStroke();
  fill(45,45,45,45);
  rect(1,125+1,165,50,3); //drop-shadow
  fill(colorList[1]);

  push();
  rectMode(CORNER);
  // noFill();
  // stroke(255);
  // rect(-83,98,166,53);
  hit_start = collidePointRect(mouseX-width/2,mouseY-height/2,-83,98,166,53);
  pop();

  if(hit_start==true) {
    fill(89,210,220);
    setTimeout(function() {radarOn=true;},transTime);
    hit_start=false;
}
  rect(0,125,165,50,3);
  fill(colorList[2]);
  textSize(32);
  text(txtLabel,0,135);
}
function demoButton(txtLabel) {
  var hit_demo = false;
  noStroke();
  fill(45,45,45,45);
  rect(1,185+1,115,35,3); //drop-shadow
  fill(colorList[1]);

  push();
  rectMode(CORNER);
  // stroke(255);
  // noFill();
  // rect(-62,165,123,38);
  hit_demo = collidePointRect(mouseX-width/2,mouseY-height/2,-62,155,123,38);
  pop();

  if(hit_demo==true) {
    fill(colorList[4]);
    setTimeout(function() {demoTitlesOn=true;},transTime);
    hit_demo=false;
}

  rect(0,185,115,35,3);

  fill(102,102,102);
  textSize(21);
  text(txtLabel,0,192);
}

function flag_ita(faded) { //faded è il parametro che serve per opacizzare le bandiere nel caso siano deselezionate
  var hit_it = false;
  image(flag_it,1+width/2.78,-height/2.1); //ex height: -240
  fill(159,211,214,faded);
  rect(width/2.45,-height/2.16,width/8,-height/5);

  push();
  rectMode(CORNER);
  // stroke(255);
  // rect(1+width/2.85,-height/2.05,width/8.2,height/15)
  hit_it = collidePointRect(mouseX-width/2,mouseY-height/2,1+width/2.85,-height/2.05,width/8.2,height/15);
  if(hit_it==true) {
    faded_en=145;
    faded_it=0;
    eng=false;
    ita=true;
    hit_it=false;
  }
  pop();
}

function flag_eng(faded) {
  var hit_en = false;
  image(flag_en,width/4.15,-height/2.1); //ex height: -240
  fill(159,211,214,faded);
  rect(width/3.5,-height/2.16,width/8,-height/5);

  push();
  rectMode(CORNER);
  // stroke(255);
  // rect(1+width/4.6,-height/2.05,width/8.2,height/15)
  hit_en = collidePointRect(mouseX-width/2,mouseY-height/2,1+width/4.6,-height/2.05,width/8.2,height/15);
  if(hit_en==true) {
    faded_en=0;
    faded_it=145;
    eng=true;
    ita=false;
    hit_en=false;
  }
  pop();
}

function bMenu() { //il menu per uscire dalla modalità scalata
var backTxt,
    yesTxt;
var hit_yes=false;
var hit_no=false;

if(eng==true) {
  if(sequoiaDemoOn==false && burjDemoOn==false) {
    backTxt="Back to radar?"; yesTxt="sì"; textSize(21);
  }
  else{backTxt="Back to demos?";}
  yesTxt="yes"; textSize(24);
};

if(ita==true) {
  if(sequoiaDemoOn==false && burjDemoOn==false) {
  backTxt="Tornare al radar?"; yesTxt="sì"; textSize(21);
  }
  else{backTxt="Tornare alle demo?";}
  yesTxt="sì"; textSize(24);
};
noStroke();
rectMode(CENTER);
fill(45,45,45,45);
rect(0+2,-height/12+2,width/1.2,height/4,3);
fill(colorList[1]);
rect(0,-height/12,width/1.2,height/4,3);
fill(45,45,45);
textAlign(CENTER);
text(backTxt,0,-height/8);

push();
noFill();
stroke(45,45,45,45);
strokeWeight(3);
rect(-width/6,-height/25,width/5,height/12,3);
rect(width/6,-height/25,width/5,height/12,3);

push();
noStroke();
fill(45,45,45,125);
textAlign(CENTER);
text(yesTxt,-width/6,-height/35);
text('no',width/6,-height/35);
pop();

push();
rectMode(CORNER);
// stroke(255);
// strokeWeight(1);
// rect(width/16,-height/11,width/4.7,height/10);
hit_yes = collidePointRect(mouseX-width/2,mouseY-height/2,-width/3.7,-height/11,width/4.7,height/10);
if(hit_yes==true) {
  metriTOT=0;
  movY=0;
  metriPrec=0;
  movSwitcher=false;
  infoOn=false;
  infoOpen=true;

  backUpPositionDist=[];
  conv=0;
  mask.clear();
  (imgClone = imgLink[scelto].get()).mask( mask.get() );
  scelto=-1;
  check_scal=false;

  if(sequoiaDemoOn==false && burjDemoOn==false) {
    setTimeout(function() {
    burjDemoOn=false;
    titleScreenOn=false;
    demoTitlesOn=false;
    infoOn=false;
    backMenu=false;
    radarOn=true;

    f=300;
    hit_yes=false;
    },100);
  }

  else {
  setTimeout(function() {
  sequoiaDemoOn=false;
  burjDemoOn=false;
  titleScreenOn=false;
  demoTitlesOn=true;

  f=300;

  hit_yes=false;
  },100);
  }
};
hit_no = collidePointRect(mouseX-width/2,mouseY-height/2,width/16,-height/11,width/4.7,height/10);
if(hit_no==true) {
  backMenu=false;
  hit_no=false;
};
pop();

pop();
}

function windowResized() {
    resizeCanvas(innerWidth,innerHeight);
    mask = createGraphics(width,height);
} //ridimensionatore della schermata

function drawIconOnRadar() {
  var circle = (70+width/1-r),
      posXPointer = 0;
      posYPointer = height/11,

  push();

    imageMode(CENTER)
    translate(posXPointer,posYPointer)
    // for (var i=0; i < myData.landmarks_en.length; i++) { //Disegna tutte le icone
    for (var i=0; i < myData.landmarks_en.length-2; i++) { //Disegna tutte le icone

      var wImg,
          hImg,
          wElli,
          hEll,

          distCoord = dist(0,0, posRelMe[i].Lon, posRelMe[i].Lat)

          xOut = (circle/2)*cos(posRelMe[i].Ang-90),
          yOut = (circle/2)*sin(posRelMe[i].Ang-90)-(hImg/2),
          xIn = (distCoord*zoom)*cos(posRelMe[i].Ang-90),
          yIn = (distCoord*zoom)*sin(posRelMe[i].Ang-90)-(hImg/2);

          if(dist(0,0,(posRelMe[i].Lon)*zoom,(posRelMe[i].Lat)*zoom*(-1))<(circle/2)) {
            wImg = map(zoom,limSupZoom,limInfZoom,15,50);
            hImg = map(zoom,limSupZoom,limInfZoom,30,90);
            wElli = map(zoom,limSupZoom,limInfZoom,28,75);
            hElli = map(zoom,limSupZoom,limInfZoom,5,25);
          }
          else {
            wImg = map(zoom,limSupZoom,limInfZoom,15,50);
            hImg = map(zoom,limSupZoom,limInfZoom,30,90);
            wElli = map(zoom,limSupZoom,limInfZoom,28,75);
            hElli = map(zoom,limSupZoom,limInfZoom,5,25);
          }

      hit_struct[i] = false;

      if (dist(0,0,(posRelMe[i].Lon)*zoom,(posRelMe[i].Lat)*zoom*(-1))>(circle/2)) {  //Se l'icona è fuori dal radar
        if (myData.landmarks_en[i].visit==false) {
          fill(45,45,95,70);
          ellipse(xOut, yOut+(hImg/2), wElli, hElli);
          image(imgLinkGray[i], xOut, yOut , wImg, hImg);
        } //Se l'icona non è stat visitata
        else {
          fill(45,45,95,70);
          ellipse(xOut, yOut+(hImg/2), wElli, hElli);
          image(imgLinkColore[i], xOut, yOut , wImg, hImg);
        } //Se l'icona è stat visitata
      }

      else if (posRelMe[i].dist<distCliccable) {
        fill(244,128,33,210);
        ellipse(xIn, yIn+(hImg/2), wElli, hElli);
        if (myData.landmarks_en[i].visit==false) {
          fill(45,45,95,70);
          image(imgLinkGray[i], xIn, yIn , wImg, hImg);
        } //Se l'icona non è stat visitata
        else {
          fill(45,45,95,70);
          image(imgLinkColore[i], xIn, yIn , wImg, hImg);
        } //Se l'icona è stat visitata
      } //Se l'icona si trova nelle vicinanze

      else {  //Se l'icona è dentro il radar
        if (myData.landmarks_en[i].visit==false) {
          fill(45,45,95,70);
          ellipse(xIn, yIn+(hImg/2), wElli, hElli);
          image(imgLinkGray[i], xIn, yIn, wImg, hImg);
        } //Se l'icona non è stat visitata
      else {
          fill(45,45,95,70);
          ellipse(xIn, yIn+(hImg/2), wElli, hElli);
          image(imgLinkColore[i], xIn, yIn, wImg, hImg);
        } //Se l'icona è stat visitata
    }
    push();
    noFill();
    stroke(45,45,45);
    strokeWeight(2);
    //rectMode(CENTER);


    // questo è il mio codice:

    //praticamente il la hitbox sembra sempre spostata verso l'alto di un valore fisso, se lo zoom è al massimo sembra che sia sposta verso l'altro di poco, se invece lo zoom è al minimo la hitbox è completamente spostato verso l'alto sopra l'icona, sembra sempre dello stesso valore.
    //forse ha a che fare con il mouseX-width/2,mouseY-height/2...
    push();
    //translate(-posXPointer,-posYPointer)
    //rect(xIn,yIn,wImg,hImg);
    hit_struct[i]=collidePointRect(mouseX-width/2,mouseY-height/2,xIn-wImg/2,yIn+height/13,wImg,hImg)
    pop();
    //questo è il codice originale:

    //rect( (posRelMe[i].Lon)*zoom,(posRelMe[i].Lat)*zoom*(-1)-35,40,80 );
    //hit_struct[i]=collidePointRect(mouseX-width/2,mouseY-height/2,(posRelMe[i].Lon)*zoom-20,(posRelMe[i].Lat)*zoom*(-1)-17,40,80)

    // if(hit_struct[i]==true){
    //
    //   push();
    //   translate(0,-posYPointer) //counter posYPointer
    //   climbMode(i,true,2,1.25,-700,200); //structNum,cloudBool,cloudX,cloudY,cloudMin,cloudMax
    //   pop();
    //   hit_struct[i]=false;
    // };
    pop();
  }
  // console.log(hit_struct);
  pop();
}

//Aggiungi dati al oggetto posRelMe per calcolare tutti i dati che ci servono per le icone sul radar:
  function calcPosRelMe() {
    for (var i=0; i < myData.landmarks_en.length; i++) {
      posRelMe[i] = {"name": "", "Lat": "", "Lon": "", "Ang": "", "distX": "" , "distY": "", "dist": ""},
      posRelMe[i].name = myData.landmarks_en[i].name;
      posRelMe[i].Lat = myData.landmarks_en[i].Lat - myLat;
      posRelMe[i].Lon = myData.landmarks_en[i].Lon - myLon;

      posRelMe[i].distX = measure(myData.landmarks_en[i].Lat, 0, myLat, 0);
      posRelMe[i].distY = measure(0, myData.landmarks_en[i].Lon, 0, myLon);

      posRelMe[i].dist = measure(myData.landmarks_en[i].Lat, myData.landmarks_en[i].Lon, myLat, myLon);

      var headingAng = 0;
      if (nordIsUp == false) {headingAng = -heading_tot;}

      if ((posRelMe[i].Lon>0)&&(posRelMe[i].Lat>0)) {posRelMe[i].Ang = (atan(posRelMe[i].distY/posRelMe[i].distX))+headingAng;}
      if ((posRelMe[i].Lon>0)&&(posRelMe[i].Lat<0)) {posRelMe[i].Ang = 180-(atan(posRelMe[i].distY/posRelMe[i].distX))+headingAng;}
      if ((posRelMe[i].Lon<0)&&(posRelMe[i].Lat<0)) {posRelMe[i].Ang = 180+(atan(posRelMe[i].distY/posRelMe[i].distX))+headingAng;}
      if ((posRelMe[i].Lon<0)&&(posRelMe[i].Lat>0)) {posRelMe[i].Ang = 360-(atan(posRelMe[i].distY/posRelMe[i].distX))+headingAng;}


  }
}

//Funzioni di Interazione

function keyTyped() {
  if (key== "q") {zoomIn()}
  else if (key== "w") {zoomOut()}
}

function zoomIn() {
  if (zoom<limInfZoom) {zoom*=zoomIncrement; /*console.log(zoom)*/}
  else {console.log("Limite zoom In raggiunto")}
}
function zoomOut() {
  if (zoom>limSupZoom) {zoom/=zoomIncrement; /*console.log(zoom)*/}
  else {console.log("Limite zoom Out raggiunto")}
}


//Funzioni di Geolocalizzazione più opizioni

function stabilizzation() {
  if (stabilizzato==false) { //Stabilizzazione
    if (isNaN(metriPrec)==false) {backUpstabilizzation.push(metriPrec);} //se la distanza è un valore numerico mettila nell Array della stabilizzazione
    if (backUpstabilizzation.length>maxStabilizzationArray) {backUpstabilizzation.shift()}
    if ((backUpstabilizzation.length==4)&&(stabilizzationTOT<accuracyLimit)) {stabilizzato=true; console.log("stabilizzato")}; //se la sommatoria delle

    stabilizzationTOT = backUpstabilizzation.sum();
  }
}

// Funzioni per chiamare getLocationUpdate() (funziona anche senza chiamere )

function showLocation(position) {
    myLat = position.coords.latitude; //prendi la latitudine dell'utente
    myLon= position.coords.longitude; //prendi la longitudine dell'utente
    accuracy = position.coords.accuracy; //prendi l'accuratezza della precisione dell'utente
    heading = position.coords.heading; //prendi la direzione rispetto al nord dell'utente


    if(heading!=null){
        heading_tot=heading;
    }
    numeroAgg++

    backUpPositionLat.push(myLat); //aggiungi la latitudine alla Array di backup delle latitudini
    backUpPositionLon.push(myLon); //aggiungi la longitudine alla Array di backup delle longitudini

    if(stabilizzato==false || climbOn==true){
        metriPrec = measure(backUpPositionLat[numeroAgg],backUpPositionLon[numeroAgg],backUpPositionLat[numeroAgg-1],backUpPositionLon[numeroAgg-1]) //calcola la distanza tra la posizione precedente è quella attuale
        metriPrec = Math.round(metriPrec*100)/100 //arrotonda la distanza precedente
    }
    if(stabilizzato==true && radarOn==true){
        calcPosRelMe();
    }
    if(stabilizzato==false){
        stabilizzation() //Stabilizzazione
    }
    if(climbOn==false && stabilizzato==true){
        metriPrec=0;
        head_scal=null;
        conta_head=0;
    }
    if(climbOn==true){

        // console.log(conv);
       if ((stabilizzato==true)&&(metriTOT<myData.landmarks_en[scelto].height)&&(metriPrec>accuracyLimit)&&check_scal==true) {
          if((head_scal==null && heading!=null) || (conta_head<8 && heading!=null)){
             head_scal=heading;
             heading_tot=head_scal;
             conta_head++; //contatore per tollerare nei primi metri di camminata l'assestamento dell'heading
          }
          if (isNaN(metriPrec)==false) {backUpPositionDist.push(metriPrec);} //se gli aggiornamenti hanno raggiunto la quota di 15. inizia ad aggiungere le distanze percorse alla Array di tutte le distanze
          metriTOT = backUpPositionDist.sum(); //fai la sommatoria della Array di tutte le distanze percorse per sapere la distanza totale percorsa

          conv = map(metriTOT, 0, myData.landmarks_en[scelto].height, 0, map(myData.landmarks_en[scelto].hPx,0,1280,0,height-height/12)); //converte la distanza in m in pixel di scalata



          ( imgClone = imgLink[scelto].get() ).mask( mask.get() );

           //imposta la maschera appena creata al immagine imgClone


       }
       if(metriTOT>=myData.landmarks_en[scelto].height && check_scal==true && (metriPrec>accuracyLimit)){
           myData.landmarks_en[scelto].visit=true;//icona visitata
           myData.landmarks_it[scelto].visit=true;

           conta_head=0;
           metriTOT=myData.landmarks_en[scelto].height;
           // console.log(height-height/10);
           conv=map(myData.landmarks_en[scelto].hPx,0,1280,0,height-height/10);
           rectMode(CORNER);
           //mask.rect((width-((height-height/11)/(1280/720)))/2,height/11,(height-height/11)/(1280/720),(height-height/11));
           mask.rect(0,height-Math.round(map(conv,0,(height-height/10),0,height)),width,Math.round(map(conv,0,(height-height/10),0,height)));
           (imgClone = imgLink[scelto].get() ).mask( mask.get() );
           rectMode(CENTER);
           //check_scal=false;
       }

    }
  }

function errorHandler(err) {
    if (err.code == 1) {
      alert("Error: Access is denied!");
     }

    else if ( err.code == 2) {
      alert("Error: Position is unavailable!");
    }

    else if ( err.code == 3) {
      alert("Error: Timeout");
    }

    else if ( err.code == 0) {
      alert("Error: an unkown error occurred");
    }
  }

function getLocationUpdate(){
    if(navigator.geolocation){
     // timeout at 60000 milliseconds (60 seconds)
    var options = {
     timeout:60000,
     maximumAge:10000,
     enableHighAccuracy: true};

     geoLoc = navigator.geolocation;
     watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
    }

    else{
      alert("Sorry, browser does not support geolocation!");
     }


    }

    function stopWatch(){
     geoLoc.clearWatch(watchID);
    }

function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
      var R = 6378.137; // Radius of earth in KM
      var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
      var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d * 1000; // meters
    }

Array.prototype.sum = function() {
		    var total = 0;
		    for(var i = 0; i < this.length; i += 1) {total += this[i];}
		    return total;
	  };
