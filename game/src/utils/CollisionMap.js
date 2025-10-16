export default class CollisionMap {
  constructor(scene, mapKey) {
    this.scene = scene;
    this.mapKey = mapKey;
    this.collisionData = null;
    this.width = 0;
    this.height = 0;
  }

  /**
   * Generate collision map from the level image
   * Green pixels (island) are walkable, water/other colors are not
   */
  generateFromImage() {
    const texture = this.scene.textures.get(this.mapKey);
    const source = texture.getSourceImage();
    
    this.width = source.width;
    this.height = source.height;
    
    // Create a canvas to read pixel data
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(source, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const pixels = imageData.data;
    
    // Create collision array (true = walkable, false = not walkable)
    this.collisionData = new Array(this.width * this.height);
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Check if pixel is green (island terrain)
      // Green island appears to have RGB values around: R:130-160, G:170-200, B:100-140
      // Expanded range for better detection
      const isGreen = (
        r >= 100 && r <= 180 &&
        g >= 150 && g <= 220 &&
        b >= 80 && b <= 160
      );
      
      const index = i / 4;
      this.collisionData[index] = isGreen;
    }
    
    // Count walkable pixels for debugging
    const walkableCount = this.collisionData.filter(v => v === true).length;
    const totalPixels = this.collisionData.length;
    const percentage = ((walkableCount / totalPixels) * 100).toFixed(2);
    console.log(`CollisionMap generated: ${this.width}x${this.height}`);
    console.log(`Walkable pixels: ${walkableCount} / ${totalPixels} (${percentage}%)`);
  }

  /**
   * Check if a position is walkable
   */
  isWalkable(x, y) {
    // Round to nearest pixel
    x = Math.floor(x);
    y = Math.floor(y);
    
    // Out of bounds check
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    
    const index = y * this.width + x;
    const walkable = this.collisionData[index] === true;
    
    return walkable;
  }

  /**
   * Check if a rectangle area is walkable (for sprite collision boxes)
   * Checks corners and center of the collision box
   */
  isAreaWalkable(x, y, width, height) {
    const points = [
      { x: x - width/2, y: y - height/2 },  // Top-left
      { x: x + width/2, y: y - height/2 },  // Top-right
      { x: x - width/2, y: y + height/2 },  // Bottom-left
      { x: x + width/2, y: y + height/2 },  // Bottom-right
      { x: x, y: y }                         // Center
    ];
    
    for (const point of points) {
      if (!this.isWalkable(point.x, point.y)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get map dimensions
   */
  getDimensions() {
    return {
      width: this.width,
      height: this.height
    };
  }
}

