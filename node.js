const draw_tree = require('./asciitree');

/**
 *  © Allan Elleuch
 * 
 * Generic tree implementation
 * Each node have a value that is used as a label and also a count value that are agregated each time we add new path we common hierarchy 
 * 
 * children are store in a map instead of a list, this allow better scalability if the tree becomes complexe, with respectively :
 * - Insertion: O(1)
 * - Lookup: O(1)
 * - Deletion: O(1)
 */

module.exports = class Node {
    // node children, a tree node can have 0 or more child
    children;
    // parent node, a tree node can only have one parents
    parent;
    // number value used to agregate count
    count;
    // value stored in the node, it it also used as a label to identify children
    value;

    constructor(value) {
        this.value = value ? value : '';
        this.children = new Map();
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
    addListOfLabel(listOfPath, count) {
        console.log(`call add list of path ${listOfPath} :  ${count}`)
        for (const label of listOfPath) {
            let child = this.getChild(label)
            if (child) {
                child.addCount(count);
                listOfPath.shift();
                child.addListOfLabel(listOfPath, count);
            } else {
                let val = listOfPath.shift();
                let newNode = new Node(val)
                newNode.addCount(count);

                this.addChild(newNode);
                newNode.addListOfLabel(listOfPath, count);

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
        this.children.set(node.getValue(), node);
    }

    /**
     * Return a child with the associated label or return undefined
     */
    getChild = function (label) {
        let child = this.children.get(label)
        if (child) {
            return child
        }
        return undefined;
    }

    /**
     * return the list of children associated to this node
     * complexity n where n is the number of child
     */
    getChildren = function () {
        // return this.children;
        const iterator = this.children.values();
        return Array.from(iterator)
    }

    /**
     * Remove all children
     */
    removeChildren = function () {
        // this.children = [];
        this.children = new Map();
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


        for (const child of this.getChildren()) {
            listOfPath = child.deepSearch(fullPath, listOfPath);
        }

        return listOfPath;
    }

    /**
     * Run the deepSearch function but from the child instead of the current node
     */
    deepSearchFromChild = function () {
        let listOfPath = []
        for (const child of this.getChildren()) {
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
            return node.getChildren();
        };
        return draw_tree(this, get_title, get_nodes);
    }
}
