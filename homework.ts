
import * as fs from "fs";
import * as path from "path";
import { Node } from './node';
import { AgregatedData } from './agregatedData';
// const path = require('path');
// const fs = require('fs');

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

function getJSONFiles(pathFolder: string) {


    let listOfJsonFile: AgregatedData[] = [];
    //requiring path and fs modules

    //joining path of directory 
    const directoryPath: string = path.join(pathFolder);
    //list of files name
    let files: string[] = fs.readdirSync(directoryPath);


    //agregating all files using forEach
    files.forEach(function (file) {
        if (!file.includes('-agg.json')) {

            const filePath: string = path.join(pathFolder, file);
            let rawdata: Buffer = fs.readFileSync(filePath);
            let jsonDataFromFiles: AgregatedData = JSON.parse(rawdata.toString('utf8')) as AgregatedData;
            listOfJsonFile.push(jsonDataFromFiles);
        }

    });
    return listOfJsonFile;

}

/**
 * 
 * @param folderPath a folder path
 * @return the last foldername from folder path
 */
function getFolderNameFromPath(folderPath: string) {
    let folderPathArray = folderPath.split('/');
    return folderPathArray[folderPathArray.length - 1];
}


var myArgs: string[] = process.argv;


let folderPath: string;
if (myArgs.length > 2) {
    folderPath = myArgs[2]

} else {
    folderPath = "datasource"
}

/**
 *  Step 1 : Agregate the data from files by Building a Tree 
 */

let listOfJSON: AgregatedData[] = getJSONFiles(folderPath);

/**
 *  Step 2 : Agregate the data from files by Building a Tree
 */

/**
 * We are gonna project all the data from files in the folderPath to a generic tree
 * The first node of the tree will contain the time data 
 * then all the child will have folder hirarchie as value ( i.e  child level 1 will have code1 => child level 2 will have code2 )
 */
var root = new Node('root');

/**
 * Parse each files data and add it to the root node
 */
for (let data of listOfJSON) {

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
    listOfPath = listOfPath.filter(function (el: string) {
        return el != "";
    });
    listOfNodeLabel = listOfNodeLabel.concat(listOfPath);

    // This function parse the list and add it's element to our root node
    root.addListOfLabel(listOfNodeLabel, count);

}


/**
 *  Step 3 : Extract the data from the tree as a list of object
 */

let agregatedData: AgregatedData[] = []
for (const timenode of root.getChildren()) {
    const time = timenode.getValue();

    /**
     * 
     *   call a recursive function that parse each node in the same way as a Depth-first search and then 
     * return for each node  an agregatedData object with :
     * - the agregated path from the root to each node
     * - it's associated count
     */
    let deepSearchResult: AgregatedData[] = timenode.deepSearchFromChild();
    //add time to agregated data and add it to agregatedData that will be wrote to a json file later
    deepSearchResult.filter(function (el: AgregatedData) {
        el.time = time;
        agregatedData.push(el);
    });

}

/**
 *  Step 4 : Write our data to a json file name $foldername-agg.json
 */


let folderName = getFolderNameFromPath(folderPath);
let fileToWrite = `${folderPath}/${folderName}-agg.json`


// for better output of the JSON.stringify we defined space as 4 and replacer as null otherwise it render one line json that are difficult to read
fs.writeFileSync(fileToWrite, JSON.stringify(agregatedData, null, 4));

/**
 *  Step 5 : Print usefull data
 */
console.log("Tree representation of the agregated data");
console.log(root.toString());
console.log(`Agregated data saved at: ${fileToWrite}`);
