import * as THREE from 'three';

import { ENoteType } from 'src/types';

/**
 * Get all textures from given material
 * @param material
 * @returns textures
 */
export function getAllTexturesFromMaterial(material: THREE.Material): THREE.Texture[] {
  const textures: THREE.Texture[] = [];

  // Iterate over the material properties
  for (const prop in material) {
    // @ts-ignore
    const value = material[prop];

    // Check if the property is a texture
    if (value instanceof THREE.Texture) {
      textures.push(value);
    }
  }

  return textures;
}

/**
 * Dispsoe single texture
 * @param texture
 * @returns
 */
export function disposeTexture(texture?: THREE.Texture | null): void {
  if (!texture) return;

  // Dispose texture
  texture.dispose();
}

/**
 * Dispose mutliple textures
 * @param textures
 * @returns
 */
export function disposeTextures(textures: Array<THREE.Texture | null | undefined>): void {
  for (const texture of textures) {
    disposeTexture(texture);
  }
}

/**
 * Dispose single material
 * @param material
 * @returns
 */
export function disposeMaterial(material?: THREE.Material | null): void {
  if (!material) return;

  const textures = getAllTexturesFromMaterial(material);
  // Dispose material
  material.dispose();
  // Dispose textures
  disposeTextures(textures);
}

/**
 * Dispose multiple materials
 * @param materials
 * @returns
 */
export function disposeMaterials(materials: Array<THREE.Material | null | undefined>): void {
  for (const material of materials) {
    disposeMaterial(material);
  }
}

/**
 * Dispose single object
 * @param object
 * @returns
 */
export function disposeObject(object?: THREE.Object3D | null): void {
  if (!object) return;

  // Detach from hierarchy
  object.removeFromParent();

  // Traverse children to dispose geometries and materials
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const { geometry, material } = child as THREE.Mesh;

      // Dispose geometry
      geometry.dispose();

      // Dispose material
      if (Array.isArray(material)) {
        disposeMaterials(material);
      } else {
        disposeMaterial(material);
      }
    }
  });
}

/**
 * Dispose multiple objects
 * @param objects
 * @returns
 */
export function disposeObjects(objects: Array<THREE.Object3D | null | undefined>): void {
  for (const object of objects) {
    disposeObject(object);
  }
}

/**
 * Get color by note type
 */
export function getHexColorByNoteType(noteType: ENoteType): number {
  if (noteType === ENoteType.RED) return 0xff0000;
  if (noteType === ENoteType.BLUE) return 0x0000ff;

  return 0x000000;
}
