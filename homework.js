
const Node = require('./node');
const path = require('path');
const fs = require('fs');

/**
 *  © Allan Elleuch
 */

/**
 *  
 * Here are the steps we will do to do the homework
 * I wrote all the code except the asciitree.js that I took from the Github of Anton Medvedev
 * 
 *  Step 1 : Fetching files data from folder
 *  Step 2 : Agregate the data from files by Building a Tree 
 *  Step 3 : Extract the data from the tree as a list of object
 *  Step 4 : Write our data to a json file name $foldername-agg.json
 */


/**
 *  scan folders and return a list of file path from the targeted folder
 */

function getJSONFiles(pathFolder) {


    listOfJsonFile = [];
    //requiring path and fs modules

    //joining path of directory 
    const directoryPath = path.join(pathFolder);
    //list of files name
    let files = fs.readdirSync(directoryPath);


    //agregating all files using forEach
    let data = files.forEach(function (file) {
        if (!file.includes('-agg.json')) {

            const filePath = path.join(pathFolder, file);
            let rawdata = fs.readFileSync(filePath);
            let jsonDataFromFiles = JSON.parse(rawdata);
            listOfJsonFile.push(jsonDataFromFiles);
        }

    });
    return listOfJsonFile;

}

function getFolderNameFromPath(folderPath) {
    folderPathArray = folderPath.split('/');
    return folderPathArray[folderPathArray.length - 1];
}


var myArgs = process.argv;
console.log(myArgs);


let folderPath;
if (myArgs.length > 2) {
    folderPath = myArgs[2]

} else {
    folderPath = "datasource"
}

/**
 *  Step 1 : Agregate the data from files by Building a Tree 
 */

let listOfJSON = getJSONFiles(folderPath);


/**
 *  Step 2 : Agregate the data from files by Building a Tree
 */

/**
 * We are gonna project all the data from files in the folderPath to a generic tree
 * The first node of the tree will contain the timestamp data 
 * then all the child will have folder hirarchie as value ( i.e  child level ! will have code1 => child level ! will have code2 )
 */
var root = new Node('root');

/**
 * Parse each files data and add it to the root node
 */
for (const data of listOfJSON) {

    /**
     * Parse data from the json 
     */
    let target = data.target;
    let time = data.time;
    let count = data.count;

    /**
     * all the element in this variable will be added latter as consecutive node to the root node
     * the time will be the first node
     */
    var listOfNodeLabel = [time]

    // split the path to a list. Each element are gonna be a node in our tree
    var listOfPath = target.split('/');

    // return an array free of empty string
    listOfPath = listOfPath.filter(function (el) {
        return el != "";
    });
    listOfNodeLabel = listOfNodeLabel.concat(listOfPath);

    // This function parse the list and add it's element to our root node
    root.addListOfPath(listOfNodeLabel, count);

}

/**
 *  Step 3 : Extract the data from the tree as a list of object
 */


let agregatedData = []
for (const timenode of root.getChildrens()) {
    const time = timenode.getValue();

    // call a recursive function that return a list of object that contain the agregated path of each node, and it's associated count
    let deepSearchResult = timenode.deepSearchFromChild();
    for (const data of deepSearchResult) {
        agregatedData.push({
            "target": data.path,
            "time": time,
            "count": data.count
        })
    }

}

/**
 *  Step 4 : Write our data to a json file name $foldername-agg.json
 */


let folderName = getFolderNameFromPath(folderPath);
let fileToWrite = `${folderPath}/${folderName}-agg.json`


// for better output of the JSON.stringify we defined space as 4 and replacer as null otherwise it render one line json that difficult to read
fs.writeFileSync(fileToWrite, JSON.stringify(agregatedData, null, 4));

/**
 *  Step 5 : Print usefull data
 */
console.log("Tree representation of the agregated data");
console.log(root.toString());
console.log(`Agregated data saved at: ${fileToWrite}`);
