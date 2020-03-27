# Homework Description

## Aggregating data

We have one data source: a folder with json files. Each file contains a json object.


```json
{ 
  "target_path": "/code1/code2/code3",
  "time": "2020-01-23",
  "count": 12
}
```
```json
{ 
  "target_path": "/code1/code2",
  "time": "2020-01-23",
  "count": 5
}
```
```json
{ 
  "target_path": "/code1/code2/code3",
  "time": "2020-01-23",
  "count": 13
}
```
```json
{ 
  "target_path": "/code1",
  "time": "2020-01-23",
  "count": 15
}
```

```json
{ 
  "target_path": "/code1",
  "time": "2020-01-24",
  "count": 15
}
```


The idea is to aggregate those data and end up with a count for each matching hierarchy level extracted from `target_path`.

In this example, the expected output is
```json
[
{
  "target": "/code1",
  "time": "2020-01-23",
  "count": 45
},
{
  "target": "/code1/code2",
  "time": "2020-01-23",
  "count": 30
},
{
  "target": "/code1/code2/code3",
  "time": "2020-01-23",
  "count": 25
},
{
  "target": "/code1",
  "time": "2020-01-24",
  "count": 15
}
]
```

where the first element is the top level aggregation "code1" with a count of 45 (The sum of all elements having `code1` as first part of their path)

### Work

Your job is to implement the program that will perform the merge shown above. You can code in the language of your choice.
Your program will take as a single argument the path to the folder containing the datasource.

```
./homework path/to/datasource
```

The expected output file should be name as follow: `<datasource-folder-name>-agg.json`, the file has to be placed at the same level as the datasource folder.

In order to test the homework, we will issue the following command:

```
./homework-check homework path/to/datasource
```

Which will execute your program with the datasource path as the first argument as stated in the first paragraph and check the output.



# Implementation of Homework

## Description
I decided to use Typescript to do the homework.

I created different :

- agregatedData.ts : An agregatedData class to represent the data in the json files
- node.ts : A Node Class to agregate the data on a generic tree
- asciitree.js : Credit goes to Anton Medvedev, I borrowed his class to help visualise the node tree with an ascii representation

## Note
I modified the json inside the datasource to be like the example in the readme

## Visuals

### Output in terminal
![alt text](https://github.com/AllanElleuch/code-challenge-homework-Aggregating-data/blob/master/screenshoots/run.JPG "output in a terminal with an ascii tree")

### JSON Output 
![alt text](https://github.com/AllanElleuch/code-challenge-homework-Aggregating-data/blob/master/screenshoots/output-json.JPG "formated json output")

## Run the homework
Run the following to run the homework
```
npm i
npm start
```

or

```
npm i
ts-node  .\homework.ts path/to/datasource
```


