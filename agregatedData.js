/**
 *  © Allan Elleuch
 * Structure to store agregated data
 */

module.exports = class AgregatedData {
    constructor(target, time, count) {
        this.target = target ? target : '';
        this.time = time;
        this.count = count;
    }
}
