module.exports = class Photo {
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }



    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    get fileSize() {
        return this._fileSize;
    }

    set fileSize(value) {
        this._fileSize = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }
    constructor(name, createdAt, fileSize, height, width) {

        this._name = name;
        this._createdAt = createdAt;
        this._fileSize = fileSize;
        this._height = height;
        this._width = width;
    }
}
