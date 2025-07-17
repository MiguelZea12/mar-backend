import { Injectable } from '@nestjs/common';

/**
 * Factory para generar números de orden únicos
 * Patrón: Factory Method - Crea objetos sin especificar su clase exacta
 */
@Injectable()
export class OrderNumberFactory {
  /**
   * Genera un número de orden único
   * Formato: ORD-YYYY-MM-DD-HHMMSS-XXX
   */
  generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Agregar un número aleatorio de 3 dígitos para mayor unicidad
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `ORD-${year}-${month}-${day}-${hours}${minutes}${seconds}-${random}`;
  }
}
