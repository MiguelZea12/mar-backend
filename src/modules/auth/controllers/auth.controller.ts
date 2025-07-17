import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';

/**
 * Controlador de Autenticación
 * Patrón: Controller (MVC)
 */
@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registrar nuevo usuario
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El email ya está registrado' 
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Iniciar sesión
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas' 
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil del usuario' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  async getProfile(@Request() req) {
    return {
      id: req.user.id,
      nombre: req.user.nombre,
      email: req.user.email,
      telefono: req.user.telefono,
      direccion: req.user.direccion,
      empresa: req.user.empresa,
    };
  }
}
