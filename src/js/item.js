'use strict';

class Item {
    constructor(id, text) {
        this.id = id;
        this.text = text;
        // this.date for possible Date feature
    }

    setText(text) {
        this.text = text;
    }

    clone() {
        return new Item(this.id, this.text);
    }
}
