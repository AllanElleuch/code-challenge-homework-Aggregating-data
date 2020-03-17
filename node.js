const draw_tree = require('./asciitree');

/**
 *  © Allan Elleuch
 */

module.exports = class Node {
    children;
    parent;
    count;
    constructor(value) {
        this.value = value ? value : '';
        this.children = [];
        this.parent = null;
        this.count = 0;
    }

    addListOfPath(listOfPath, count) {
        for (const label of listOfPath) {
            let child = this.getChildren(label)
            if (child) {
                child.addCount(count);
                listOfPath.shift();
                child.addListOfPath(listOfPath, count);
            } else {
                let val = listOfPath.shift();
                let newNode = new Node(val)
                newNode.addCount(count);

                this.addChild(newNode);
                newNode.addListOfPath(listOfPath, count);

            }
        }

    }

    addCount(val) {
        this.count += val;
    }

    getValue() {
        return this.value;
    }

    getCount() {
        return this.count;
    }
    setValue() {
        return this.value;
    }

    setParentNode = function (node) {
        this.parent = node;
    }

    getParentNode = function () {
        return this.parent;
    }

    addChild = function (node) {
        node.setParentNode(this);
        this.children[this.children.length] = node;
    }

    getChildren = function (label) {
        for (const child of this.getChildrens()) {
            if (child.getValue() == label) {
                return child;
            }
        }
        return undefined;
    }

    getChildrens = function () {
        return this.children;
    }
    removeChildren = function () {
        this.children = [];
    }

    deepSearch = function (fullPath = "", listOfPath = []) {

        fullPath += "/" + this.getValue()
        listOfPath.push({ path: fullPath, count: this.getCount() });


        for (const child of this.getChildrens()) {
            listOfPath = child.deepSearch(fullPath, listOfPath);
        }

        return listOfPath;
    }

    deepSearchFromChild = function () {
        let listOfPath = []
        for (const child of this.getChildrens()) {
            let childNodesProcessed = child.deepSearch()
            listOfPath = listOfPath.concat(childNodesProcessed);

        }

        return listOfPath;
    }

    toString() {
        var get_title = function (node) {
            return `${node.getValue()} : ${node.count}`;
        };

        var get_nodes = function (node) {
            return node.getChildrens();
        };
        return draw_tree(this, get_title, get_nodes);
    }
}
