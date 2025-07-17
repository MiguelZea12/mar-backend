import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { Categoria } from '../../entities/categoria.entity';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async handleQuestion(message: string): Promise<{ reply: string }> {
    // Consultar productos y categorías
    const menuItems = await this.menuItemRepository.find({ relations: ['categoria'] });
    // Construir prompt
    let prompt = 'Estos son los productos del menú y sus categorías disponibles en el restaurante:';
    const categoriasMap = new Map<number, string>();
    menuItems.forEach(item => {
      if (item.categoria && !categoriasMap.has(item.categoria.id)) {
        categoriasMap.set(item.categoria.id, item.categoria.nombre);
      }
    });
    categoriasMap.forEach((nombre, id) => {
      prompt += `\nCategoría: ${nombre}`;
      menuItems.filter(i => i.categoria && i.categoria.id === id).forEach(i => {
        prompt += `\n  - ${i.nombre}: ${i.descripcion} (Precio: $${i.precio})`;
      });
    });
    prompt += `\n\nPregunta del cliente: ${message}`;
    // Llamar a OpenRouter
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: 'Eres un asistente experto en menús de restaurantes.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 256,
      }),
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No se pudo obtener respuesta del chatbot.';
    return { reply };
  }
} 