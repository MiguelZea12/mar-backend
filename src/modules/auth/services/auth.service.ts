import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cliente } from '../../../entities/cliente.entity';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';

/**
 * Servicio de Autenticación
 * Patrón: Service Layer
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registrar un nuevo usuario
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar si el email ya existe
    const existingUser = await this.clienteRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Crear el nuevo cliente
    const newClient = this.clienteRepository.create({
      nombre: registerDto.nombre,
      email: registerDto.email,
      telefono: registerDto.telefono,
      direccion: registerDto.direccion,
      password: hashedPassword,
    });

    const savedClient = await this.clienteRepository.save(newClient);

    // Generar token JWT
    const payload = { 
      sub: savedClient.id, 
      email: savedClient.email,
      nombre: savedClient.nombre 
    };
    
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60, // 7 días en segundos
      user: {
        id: savedClient.id,
        nombre: savedClient.nombre,
        email: savedClient.email,
      },
    };
  }

  /**
   * Iniciar sesión
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Buscar el usuario por email
    const user = await this.clienteRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'nombre', 'email', 'password'] // Incluir password para validación
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload = { 
      sub: user.id, 
      email: user.email,
      nombre: user.nombre 
    };
    
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60, // 7 días en segundos
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    };
  }

  /**
   * Validar usuario por ID (usado por JWT Strategy)
   */
  async validateUser(userId: number): Promise<Cliente> {
    const user = await this.clienteRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }
}
