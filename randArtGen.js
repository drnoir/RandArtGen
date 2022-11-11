// randArtGen - COMPONENT CODE

// UTILS
function genRanNum (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeSculpture(amount, data){
    let id;
    for (id = 0; id < amount; id++) {
        genArtwork(id, data);
        if (id===id%2) {
            let Light = document.createElement('a-entity');
            let randLightX;
            let randLightY;
            let randLightZ;
            let randIntensity;
            let randRotX;
            let randRotY;
            let randRotZ;
            randLightX = genRanNum(0, 4);
            randLightY = genRanNum(0, 1);
            randLightZ = genRanNum(0, 11);

            randRotX = genRanNum(0,45);
            randRotY = genRanNum(0,45);
            randRotZ = genRanNum(0, 45);
            randIntensity = genRanNum(0.1, 0.6);
            let randLightCol = randColor().toString;

            Light.setAttribute('light', 'type: spot; intensity:'+randIntensity+'decay: 0.12; penumbra: 0.24; castShadow: true');
            Light.setAttribute('color', '#' + randLightCol);
            Light.setAttribute('position', {x: randLightX, y: randLightY, z: randLightZ});
            Light.setAttribute('rotation', {x:randRotX, y: randRotY, z: randRotZ});
            document.getElementById('artContainer').appendChild(Light);
        }

    }}

function genArtwork(id, data) {
// function desc - This method accepts a rand number Param - ElmNum generated at runtime
// then assigns rand pos colours and FX, it also checks if custumGlb is on and if so renders glb instead of primitives

    //init rand pos vars
    let randX;
    let randY;
    let randZ;
    let randScaleX;
    let randScaleY;
    let randScaleZ;
    // init randomSeed val for pos
    let randSeed =  data.randSeed;
    let randSeedRandom =  genRanNum(0, randSeed);
    // init randomSeed val for Scale
    let randSeedScale =  data.randSeedScale;
    let randSeedScaleRandom =  genRanNum(0,  randSeedScale);
    //generate random positions and scale with genRandNum function
    randX = genRanNum(0, randSeedRandom);
    randY = genRanNum(0, randSeedRandom);
    randZ = genRanNum(0, randSeedRandom);
    randScaleX = genRanNum(0, randSeedScaleRandom);
    randScaleY = genRanNum(0, randSeedScaleRandom);
    randScaleZ = genRanNum(0, randSeedScaleRandom);

    let custumGlb = data.custumGlb;

    let genPiece;
    let randPart;
    let randGLB ;
    // determine if custom Obj state is true or false and generate pieces or custum GLB
    if (!custumGlb) {
        randPart = randomisePiece();
        genPiece = document.createElement(randPart);
    }
    else{
        genPiece = document.createElement('a-entity');
        randGLB = randomiseGLB(data);
        genPiece.setAttribute('gltf-model', '#'+randGLB );
    }
// generate the pieces and  assign randomness :~) *WOOP WOOP* - this is where it all comes together
    let randCol = randColor();
    genPiece.setAttribute('position', {x: randX, y: randY, z: randZ});
    genPiece.setAttribute('material', 'color', '#' + randCol);

    let withTextures= data.withTextures;
    if (withTextures) {
        let randomTexture = randomiseTexture(data);
        genPiece.setAttribute('material', 'src', '#' + randomTexture);
    }

    genPiece.setAttribute('scale', {x: randScaleX, y: randScaleY, z: randScaleZ});
    genPiece.setAttribute('name', 'genPiece');
    genPiece.setAttribute('class', 'genPiece' + id);
    genPiece.setAttribute('roughness', genRanNum(0, 1));
    genPiece.setAttribute('metalness', genRanNum(0, 0.2));
    const artContainer = document.getElementById('artContainer')
    artContainer.appendChild(genPiece);
}


// function to create a random piece
function randomisePiece(){
    //possible options of primitives in Arr
    const posPieces = ['a-box' ,'a-sphere','a-cylinder', 'a-dodecahedron', 'a-ring', 'a-circle', 'a-triangle', 'a-torus', 'a-tetrahedron'];
    //gen random index pos -1 is due to indexing of array starting from 0
    let randIndx = genRanNum(0, posPieces.length);
    let randPiece = posPieces[randIndx];
    // return string from random pos generated
    return randPiece;
}

// function to return a random texture
function randomiseTexture(data){
    const TextureIDs = data.custumTexturesIDs;
    //possible options of textures in Arr
    //gen random index pos
    let randIndx = genRanNum(0, TextureIDs.length);
    let randTexture = TextureIDs[randIndx];
    // return string from random pos generated
    return randTexture;
}

// function to return a random texture
function randomiseGLB(data){
    const GLBIDs = data.custumModels;
    //possible options of textures in Arr
    //gen random index pos
    let randIndx = genRanNum(0, GLBIDs.length);
    let randGLB= GLBIDs[randIndx];
    // return string from random pos generated
    return randGLB;
}


function randColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

AFRAME.registerComponent("rand-art-gen", {
    schema: {
        minShapes: {type: 'number', default: 10},
        maxShapes: {type: 'number', default: 20},
        custumGlb : {type: 'boolean', default: false},
        randSeed: {type: 'number', default:8},
        randSeedScale : {type: 'number', default: 2},
        withTextures: {type: 'boolean', default: true},
        custumTexturesIDs: {type: 'array', default: []},
        custumModels: {type: 'array', default: []}
    },

    init: function() {
        const el = this.el;
        const data = this.data;
        const min = data.minShapes;
        const max = data.maxShapes;

        // generate random amount of shapes based on min max vals
        const randFun = this.genRanNum( min,max );

        const container = document.getElementById('artContainer')
        if (container !== null) {
            container.parentNode.removeChild(container);
        }
        else {
            // function desc - This method creates the room
            const artContainer = document.createElement('a-entity');
            artContainer.setAttribute('id', 'artContainer' )
            artContainer.setAttribute('scale', '1 1 1' );
            artContainer.setAttribute('position', '0 0 -5');
            document.querySelector('a-scene').appendChild(artContainer);
            makeSculpture(randFun, data);
        }

        // on load generate the artwork
        let allWordsArr = [];
        allWordsArr =  this.json2array(this.loadWords());

        console.log('arr test+'+allWordsArr);
        // Create the sculpture - random number of pieces between 3 - 1
        // generate a random title
        let randTitleLength = this.genRanNum(3, 8);
        const wordsLength = allWordsArr.length;

        let artTitle = this.createRandTitle(allWordsArr, randTitleLength, wordsLength);


        console.log('title shit+'+artTitle+''+wordsLength+''+allWordsArr);
    },

    update: function () {
        // Do something when component's data is updated.
    },
    // FLUSH
    remove: function () {
        // Do something the component or its entity is detached.
    },
    // used for game state ETC
    tick: function (time, timeDelta) {
        // Do something on every scene tick or frame.
    },

    // Load common words list
    loadWords: async function (data) {
        await fetch('common.json', {})
            .then(response=>response.json())
            .then(data => {
                return data;
            })
    },
    json2array : function (json) {
        const result = [];
        let keys = Object.keys(json);
        keys.forEach(function (key) {
            result.push(json[key]);
        });
        console.log(result)
        return result;
    },
    createRandTitle: function (allWordsArr, titleLength, wordsLength) {
        let randTitle = [];
        for (let i = 0; i < titleLength; i++) {
            let randIndex = this.genRanNum(0, wordsLength-1);
            console.log(allWordsArr);
            console.log(allWordsArr[randIndex]);
            console.log(i);
            randTitle.push(allWordsArr[randIndex])
        }
        console.log('random title'+randTitle);
        return randTitle
    },
    //return random values between a min / max - resuable
    genRanNum : function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

});
