/**
 * Represents the internal core of a shelf
 */
class Shelf {
    /**
     * Builds a new shelf with the dimensions and axes values for all faces
     * @param {Array} shelf_base_face_dimensions_axes Array with the base face dimensions and axes values
     */
    constructor(shelf_base_face_dimensions_axes) {
        this.shelf_base_face_dimensions_axes = shelf_base_face_dimensions_axes.slice();
        this._prepare_shelf_init();
    }

    changeShelfWidth(width) {
        this.width = width;
    }

    //Accessors

    /**
     * Returns the current width of the shelf
     */
    getShelfWidth() { return this.shelf_base_face_dimensions_axes[0]; }

    /**
     * Returns the current height of the shelf
     */
    getShelfHeight() { return this.shelf_left_face_dimensions_axes[1]; }

    /**
     * Returns the current depth of the shelf
     */
    getShelfDepth() { return this.shelf_base_face_dimensions_axes[2]; }

    /**
     * Returns all current shelf initial faces
     */
    getInitialShelfFaces() { return this.initial_shelf_faces; }

    /**
     * Returns all current shelf faces
     */
    getShelfFaces() { return this.shelf_faces; }

    //Private Methods

    /**
     * Prepare the shelf initialization
     */
    _prepare_shelf_init() {
        this.shelf_faces = [this.shelf_base_face_dimensions_axes];
        this.initial_shelf_faces = [this.shelf_base_face_dimensions_axes.slice()];
    }
}