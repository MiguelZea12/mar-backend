import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { Categoria } from '../../entities/categoria.entity';

const SALUDOS = ['hola', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'hello', 'hi'];

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async handleQuestion(message: string): Promise<{ reply: string }> {
    const msg = message.trim().toLowerCase();
    // Si es un saludo simple, responde solo con un saludo y una pregunta
    if (SALUDOS.some(saludo => msg === saludo || msg.startsWith(saludo + ' '))) {
      return {
        reply: '¡Hola! ¿En qué puedo ayudarte con el menú hoy? ¿Te gustaría ver las categorías, los platos principales o las bebidas?'
      };
    }

    // Consultar productos y categorías
    const menuItems = await this.menuItemRepository.find({ where: { disponible: true }, relations: ['categoria'] });
    const categorias = await this.categoriaRepository.find();
    if (!categorias.length) {
      return {
        reply: 'No hay categorías registradas en el sistema aún. ¿Te gustaría consultar otra cosa?'
      };
    }

    // Buscar si la pregunta menciona una categoría
    const categoriaEncontrada = categorias.find(cat => msg.includes(cat.nombre.toLowerCase()));
    if (categoriaEncontrada) {
      const itemsCategoria = menuItems.filter(item => item.categoriaId === categoriaEncontrada.id);
      if (!itemsCategoria.length) {
        return { reply: `Actualmente no hay productos disponibles en la categoría "${categoriaEncontrada.nombre}". ¿Te gustaría consultar otra categoría o producto?` };
      }
      let respuesta = `Productos en la categoría ${categoriaEncontrada.nombre}:
`;
      itemsCategoria.forEach(i => {
        respuesta += `• ${i.nombre}: ${i.descripcion} (Precio: $${i.precio})\n`;
      });
      respuesta += '\n¿Te gustaría saber más sobre algún producto o ver otra categoría?';
      return { reply: respuesta };
    }

    // Buscar si la pregunta menciona un producto
    const productoEncontrado = menuItems.find(item => msg.includes(item.nombre.toLowerCase()));
    if (productoEncontrado) {
      let respuesta = `Información sobre "${productoEncontrado.nombre}":\n`;
      respuesta += `${productoEncontrado.descripcion} (Precio: $${productoEncontrado.precio})\n`;
      respuesta += '¿Te gustaría saber algo más o consultar otro producto?';
      return { reply: respuesta };
    }

    // Si no se encontró nada específico, responde SOLO con las categorías disponibles
    let categoriasLista = categorias.map(cat => `• ${cat.nombre}`).join('\n');
    return {
      reply: `Estas son las categorías disponibles:\n${categoriasLista}\n¿Sobre cuál te gustaría saber más?`
    };
  }
} 