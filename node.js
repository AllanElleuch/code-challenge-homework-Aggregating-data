const draw_tree = require('./asciitree');

/**
 *  © Allan Elleuch
 * 
 * Generic tree implementation
 * Each node have a value that is used as a label and also a count value that are agregated each time we add new path we common hierarchy 
 * 
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

    /**
     * for each each element (label) of list of path, this function add to a child node with the same label the count value, 
     * otherwise it create a child node with  and add the count value
     * then it shift the first value of list of path because it has been used and call this function to the child previously created/modified
     * 
     * @param {*} listOfPath 
     * @param {*} count 
     */
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

    /**
     * Increment count with val
     * @parameter val : number
     */
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

    /**
     * Return a child with the associated label or return undefined
     */
    getChildren = function (label) {
        for (const child of this.getChildrens()) {
            if (child.getValue() == label) {
                return child;
            }
        }
        return undefined;
    }

    /**
     * return the list of children associated to this node
     */
    getChildrens = function () {
        return this.children;
    }

    /**
     * Remove all children
     */
    removeChildren = function () {
        this.children = [];
    }

    /**
     * Recursive function that parse each node in the same way as a Depth-first search
     * Each time we encounter a node we agregate its parents value to its own value in the fullPath variable and then  give it to its children.
     * ListOfPath represent the agregated data of each node that will be returned at the end. 
     * It contain for each node its path from the root to this node and it's count value.  
     * 
     * 
     * */
    deepSearch = function (fullPath = "", listOfPath = []) {

        fullPath += "/" + this.getValue()
        listOfPath.push({ path: fullPath, count: this.getCount() });


        for (const child of this.getChildrens()) {
            listOfPath = child.deepSearch(fullPath, listOfPath);
        }

        return listOfPath;
    }

    /**
     * Run the deepSearch function but from the child instead of the current node
     */
    deepSearchFromChild = function () {
        let listOfPath = []
        for (const child of this.getChildrens()) {
            let childNodesProcessed = child.deepSearch()
            listOfPath = listOfPath.concat(childNodesProcessed);

        }

        return listOfPath;
    }

    /**
     * Draw a tree using ascitree.js functions
     */
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
