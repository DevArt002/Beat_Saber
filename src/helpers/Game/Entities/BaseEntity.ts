import * as THREE from 'three';

import { BaseComponent, TransformComponent } from 'src/helpers/Game/Components';
import { EComponentType, TEntityID, TXYZ } from 'src/types';

import { BaseSystem } from 'src/helpers/Game/Systems';
import { uuid } from 'src/utils';

export abstract class BaseEntity {
  protected _id: TEntityID = uuid();
  protected _object3D: THREE.Object3D | null = null;
  protected _components: Record<EComponentType, BaseComponent> = {}; // Entity should have unique components, so use EComponentType instead of id
  protected _children: Record<TEntityID, BaseEntity> = {};

  constructor(protected readonly _system: BaseSystem) {
    // Expecting transform component for all entities
    this.addComponent(new TransformComponent(this));
  }

  // Getter of system
  get system(): BaseSystem {
    return this._system;
  }

  // Getter of entity id
  get id(): TEntityID {
    return this._id;
  }

  // Getter of object
  get object3D(): THREE.Object3D | null {
    return this._object3D;
  }

  // Getter of components
  get components(): Record<EComponentType, BaseComponent> {
    return this._components;
  }

  // Getter of transform component
  get transformComponent(): TransformComponent {
    return this.getComponent(EComponentType.Transform) as TransformComponent;
  }

  // Getter of children
  get children(): Record<TEntityID, BaseEntity> {
    return this._children;
  }

  /**
   * Add single component to entity
   * @param component
   */
  addComponent(component: BaseComponent) {
    this._components[component.type] = component;
  }

  /**
   * Add multiple components
   * @param components
   */
  addComponents(components: BaseComponent[]) {
    components.forEach((component) => this.addComponent(component));
  }

  /**
   * Get single component by component type
   * @param componentType
   * @returns Component
   */
  getComponent(componentType: EComponentType): BaseComponent | null {
    return this._components[componentType] ?? null;
  }

  /**
   * Get multiple components by component type
   * @param componentTypes
   * @returns Components
   */
  getComponents(componentTypes: EComponentType[]): Array<BaseComponent | null> {
    return componentTypes.map((componentType) => this.getComponent(componentType));
  }

  /**
   * Remove single component by component type
   * @param componentType
   */
  removeComponent(componentType: EComponentType) {
    delete this._components[componentType];
  }

  /**
   * Remove multiple components by component type
   * @param componentTypes
   */
  removeComponents(componentTypes: EComponentType[]) {
    componentTypes.map((componentType) => this.removeComponent(componentType));
  }

  /**
   * Add child
   * @param entity
   */
  addChild(entity: BaseEntity) {
    this._system.game.addEntity(entity, this);
    this._children[entity.id] = entity;
  }

  /**
   * Add children
   * @param entities
   */
  addChildren(entities: BaseEntity[]) {
    entities.forEach((entity) => this.addChild(entity));
  }

  /**
   * Get child by entity id
   * @param entityId
   * @returns Entity
   */
  getChild(entityId: TEntityID): BaseEntity | null {
    return this.children[entityId] ?? null;
  }

  /**
   * Get children by entity id
   * @param entityIds
   * @returns Entities
   */
  getChildren(entityIds: TEntityID[]): Array<BaseEntity | null> {
    return entityIds.map((entityId) => this.getChild(entityId));
  }

  /**
   * Remove child by entity id
   * @param entityId
   */
  removeChild(entityId: TEntityID) {
    this._system.game.removeEntity(this._children[entityId]);
    delete this._children[entityId];
  }

  /**
   * Remove children by entity id
   * @param entityIds
   */
  removeChildren(entityIds: TEntityID[]) {
    entityIds.map((entityId) => this.removeChild(entityId));
  }

  /**
   * Set position of entity
   * @param position
   */
  setPosition(position: TXYZ) {
    this.transformComponent.position = position;
  }

  /**
   * Set rotation of entity
   * @param rotation
   */
  setRotation(rotation: TXYZ) {
    this.transformComponent.rotation = rotation;
  }

  /**
   * Set scale of entity
   * @param scale
   */
  setScale(scale: TXYZ) {
    this.transformComponent.scale = scale;
  }

  /**
   * Update
   */
  update() {
    for (const key in this._components) {
      this._components[key].update();
    }
  }

  /**
   * Dispose
   */
  dispose() {
    for (const key in this._components) {
      this._components[key].dispose();
    }
  }
}
