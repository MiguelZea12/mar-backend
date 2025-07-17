import { Injectable } from '@nestjs/common';
import { Insumo } from '../../../entities';

/**
 * Interface para observadores de alertas de inventario
 * Patrón: Observer Pattern
 */
export interface InventoryAlertObserver {
  onLowStock(insumo: Insumo): void;
  onExpiringSoon(insumos: Insumo[]): void;
}

/**
 * Servicio de alertas de inventario
 * Patrón: Observer Pattern - Subject
 */
@Injectable()
export class InventoryAlertService {
  private observers: InventoryAlertObserver[] = [];

  /**
   * Agregar un observer
   */
  addObserver(observer: InventoryAlertObserver): void {
    this.observers.push(observer);
  }

  /**
   * Remover un observer
   */
  removeObserver(observer: InventoryAlertObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notificar stock bajo
   */
  notifyLowStock(insumo: Insumo): void {
    this.observers.forEach(observer => {
      observer.onLowStock(insumo);
    });
  }

  /**
   * Notificar productos próximos a vencer
   */
  notifyExpiringSoon(insumos: Insumo[]): void {
    this.observers.forEach(observer => {
      observer.onExpiringSoon(insumos);
    });
  }
}
