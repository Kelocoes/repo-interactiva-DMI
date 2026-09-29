import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoresGateway } from './stores.gateway';
import * as fs from 'fs';
import * as path from 'path';

const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024; // Límite estricto de 3 MB

@Injectable()
export class StoresService implements OnModuleInit {
  private uploadsDir = path.join(process.cwd(), 'uploads', 'stores');

  constructor(
    @InjectRepository(StoreEntity)
    private readonly storesRepo: Repository<StoreEntity>,
    private readonly gateway: StoresGateway,
  ) {
    // Asegurar que la carpeta de almacenamiento de imágenes en disco exista
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Inicializa la base de datos con las tiendas predeterminadas de Figma si está vacía
   */
  async onModuleInit() {
    try {
      const count = await this.storesRepo.count();
      if (count === 0) {
        console.log('🌱 Inicializando tiendas iniciales en la base de datos...');
        const initialStores: Partial<StoreEntity>[] = [
          {
            id: 'caleñita-2',
            nombre: 'Obleas la caleñita',
            descripcion:
              'Las mejores obleas y postres tradicionales en San Fernando, Cali. Deliciosas capas de arequipe, queso, mermelada y frutas frescas.',
            lat: 3.4215,
            lng: -76.5458,
            address: 'Cl 5 #46B-58',
            likes: 130,
            bannerPreview: '/figma/4e1306367bc471614c5de034d2b7ba22204b0f0c.png',
            logoPreview: null,
            color1: '#FFB200',
            color2: '#5552F6',
            postres: ['A2F4B1', 'C8D3E7', '9B1F6A'],
          },
          {
            id: 'oasis-1',
            nombre: 'El Oasis',
            descripcion:
              'Un increíble lugar para tardear con tu familia, amigos, compañeros o cualquier persona que esté dispuesta a probar los postres más dulces de Cali. Un excelente ambiente con juego, recreaciones y actividades para todos los miembros de la familia.',
            lat: 3.3768,
            lng: -76.5364,
            address: 'Cra 83c #16-05',
            likes: 100,
            bannerPreview: '/figma/store_banner_oasis.png',
            logoPreview: null,
            color1: '#FBFBFB', // Texto blanco suave para Figma
            color2: '#D600C4', // Fondo del detalle y pin magenta
            postres: ['A2F4B1', 'C8D3E7', '9B1F6A'],
          },
        ];

        for (const store of initialStores) {
          const entity = this.storesRepo.create(store);
          await this.storesRepo.save(entity);
        }
        console.log('✅ Tiendas iniciales sembradas exitosamente');
      }
    } catch (err) {
      console.error('Error al sembrar tiendas iniciales:', err);
    }
  }

  /**
   * Guarda una imagen base64 en disco para no saturar la base de datos ni la memoria RAM
   */
  private processAndSaveBase64Image(
    base64Data: string | null | undefined,
    prefix: string,
  ): string | null {
    if (!base64Data) return null;

    // Si ya es una URL relativa o estática (ej: /figma/...), mantenerla
    if (base64Data.startsWith('/') || base64Data.startsWith('http')) {
      return base64Data;
    }

    const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches) {
      return base64Data;
    }

    const extension = matches[1].replace('jpeg', 'jpg');
    const buffer = Buffer.from(matches[2], 'base64');

    // Validación estricta de tamaño máximo
    if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
      const sizeMb = (buffer.length / (1024 * 1024)).toFixed(1);
      throw new BadRequestException(
        `La imagen supera el límite permitido de 3 MB (pesa ${sizeMb} MB). Por favor selecciona un archivo más liviano.`,
      );
    }

    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const filePath = path.join(this.uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/stores/${filename}`;
  }

  /**
   * Retorna todas las tiendas ordenadas por Likes descendente con soporte de búsqueda
   */
  async findAll(search?: string): Promise<StoreEntity[]> {
    if (search && search.trim()) {
      const query = `%${search.trim().toLowerCase()}%`;
      return this.storesRepo
        .createQueryBuilder('store')
        .where('LOWER(store.nombre) LIKE :query OR LOWER(store.address) LIKE :query', { query })
        .orderBy('store.likes', 'DESC')
        .getMany();
    }

    return this.storesRepo.find({
      order: {
        likes: 'DESC',
      },
    });
  }

  /**
   * Obtiene una tienda por su ID
   */
  async findOne(id: string): Promise<StoreEntity> {
    const store = await this.storesRepo.findOneBy({ id });
    if (!store) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }
    return store;
  }

  /**
   * Crea una nueva tienda guardando imágenes en disco y emitiendo por WebSocket
   */
  async create(dto: CreateStoreDto): Promise<StoreEntity> {
    const id = `store-${Date.now()}`;

    // Procesar imágenes con límite estricto de peso
    const bannerUrl = this.processAndSaveBase64Image(dto.bannerPreview, 'banner');
    const logoUrl = this.processAndSaveBase64Image(dto.logoPreview, 'logo');

    const newStore = this.storesRepo.create({
      id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      lat: dto.lat,
      lng: dto.lng,
      address: dto.address || 'Cali, Valle del Cauca',
      likes: 0,
      bannerPreview: bannerUrl,
      logoPreview: logoUrl,
      color1: dto.color1 || '#FBFBFB',
      color2: dto.color2 || '#D600C4',
      postres: dto.postres || ['A2F4B1', 'C8D3E7', '9B1F6A'],
    });

    const saved = await this.storesRepo.save(newStore);

    // Notificar en tiempo real a todos los usuarios conectados
    this.gateway.broadcastStoreCreated(saved);

    return saved;
  }

  /**
   * Operación atómica de Like / Unlike para prevenir Race Conditions en alta concurrencia
   */
  async toggleLike(id: string, action: 'like' | 'unlike'): Promise<StoreEntity> {
    const exists = await this.storesRepo.findOneBy({ id });
    if (!exists) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }

    if (action === 'like') {
      await this.storesRepo.increment({ id }, 'likes', 1);
    } else {
      await this.storesRepo
        .createQueryBuilder()
        .update(StoreEntity)
        .set({
          likes: () => 'CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END',
        })
        .where('id = :id', { id })
        .execute();
    }

    const updated = await this.storesRepo.findOneByOrFail({ id });

    // Notificar a todos los usuarios conectados en vivo
    this.gateway.broadcastStoreLiked({ id, likes: updated.likes });

    return updated;
  }

  /**
   * Elimina una tienda por ID
   */
  async remove(id: string): Promise<void> {
    await this.storesRepo.delete({ id });
  }
}
