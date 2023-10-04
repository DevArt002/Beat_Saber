import * as THREE from 'three';

import { Component } from 'src/helpers/Game/Components';
import { EComponentType } from 'src/types';
import { disposeObject } from 'src/utils';

export abstract class Entity<T extends THREE.Object3D> {
  protected _components: Set<Component<Entity<T>>> = new Set<Component<Entity<T>>>();

  constructor(protected readonly _object3D: T) {}

  // Getter of object
  get object3D(): T {
    return this._object3D;
  }

  // Getter of components
  get components(): Set<Component<Entity<T>>> {
    return this._components;
  }

  // Getter of entity id, which is same as object3D id
  get id(): number {
    return this._object3D.id;
  }

  // Getter of position, which is same as object3D position
  get position(): THREE.Vector3 {
    return this._object3D.position;
  }

  // Getter of rotation, which is same as object3D rotation
  get rotation(): THREE.Euler {
    return this._object3D.rotation;
  }

  // Getter of scale, which is same as object3D scale
  get scale(): THREE.Vector3 {
    return this._object3D.scale;
  }

  // Getter of quaternion, which is same as object3D quaternion
  get quaternion(): THREE.Quaternion {
    return this._object3D.quaternion;
  }

  // Getter of matrix, which is same as object3D matrix
  get matrix(): THREE.Matrix4 {
    return this._object3D.matrix;
  }

  // Getter of matrixWorld, which is same as object3D matrixWorld
  get matrixWorld(): THREE.Matrix4 {
    return this._object3D.matrixWorld;
  }

  /**
   * Add component to this entity
   * @param component
   */
  addComponent(component: Component<Entity<T>>) {
    this._components.add(component);
  }

  /**
   * Get component of EComponentType on this entity if it exists
   * @param type
   * @returns found component of type or null
   */
  getComponentByType(type: EComponentType): Component<Entity<T>> | null {
    for (const component of this._components.values()) {
      if (component.type === type) {
        return component;
      }
    }
    return null;
  }

  /**
   * Remove single component by type
   * @param type
   */
  removeComponentByType(type: EComponentType): void {
    for (const component of this._components) {
      if (type === component.type) {
        component.dispose();
        this._components.delete(component);
      }
    }
  }

  /**
   * Remove multiple components by type
   * @param types
   */
  removeComponentsByType(types: EComponentType[]): void {
    for (const component of this._components) {
      if (types.includes(component.type)) {
        component.dispose();
        this._components.delete(component);
      }
    }
  }

  /**
   * Add child
   */
  add(object: THREE.Object3D) {
    this.object3D.add(object);
  }

  /**
   * Update matrix
   */
  updateMatrix() {
    this.object3D.updateMatrix();
  }

  /**
   * Listener when xr presenting state is changed
   * @param isPresenting
   */
  onXRPresent(isPresenting: boolean) {}

  /**
   * Update components
   */
  protected _updateComponents(delta?: number) {
    for (const component of this._components) {
      component.update(delta);
    }
  }

  /**
   * Dispose components
   */
  protected _disposeComponents() {
    for (const component of this._components) {
      component.dispose();
    }
  }

  /**
   * Update
   */
  update(delta?: number) {
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._disposeComponents();
    disposeObject(this._object3D);
  }
}
