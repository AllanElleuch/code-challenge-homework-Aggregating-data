/**
 *  © Allan Elleuch
 * Structure to store agregated data
 */

export class AgregatedData {
    target: string;
    time: string;
    count: number;
    constructor(target: string, time: string, count: number) {
        this.target = target ? target : '';
        this.time = time;
        this.count = count;
    }
}
