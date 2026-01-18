# Project Architecture & File Structure

This document outlines the high-level architecture of the project, which follows a **modular monorepo** structure with **NestJS best practices**. The architecture emphasizes separation of concerns, code reusability, and maintainability.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Module Organization](#module-organization)
4. [Dependency Flow](#dependency-flow)
5. [Best Practices](#best-practices)
6. [Testing Strategy](#testing-strategy)

---

## Architecture Overview

This project follows a **modular architecture** with clear separation between:

- **Applications (`apps/`)**: Deployable services with controllers and API endpoints
- **Libraries (`libs/`)**: Shared business logic, entities, and utilities
- **Separation of Concerns**: Controllers handle HTTP, services handle business logic, repositories handle data
- **Testability**: Business logic is isolated and easily testable
- **Scalability**: Monorepo structure allows code sharing while maintaining clear module boundaries

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Apps Layer (Presentation)               │
│              Controllers, Guards, Interceptors           │
│                    apps/*/modules/*                      │
└──────────────────────┬──────────────────────────────────┘
                       │ uses
┌──────────────────────▼──────────────────────────────────┐
│                  Libs Layer (Business Logic)             │
│           Services, Entities, DTOs, Repositories         │
│                      libs/*/src/*                        │
└──────────────────────┬──────────────────────────────────┘
                       │ persists to
┌──────────────────────▼──────────────────────────────────┐
│                    Database Layer                        │
│              TypeORM, PostgreSQL, Redis                  │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
/
├── apps/                          # Deployable applications
│   ├── app/                       # Main customer-facing API
│   │   ├── src/
│   │   │   ├── config/            # App-specific configuration
│   │   │   ├── modules/           # Feature modules (controllers only)
│   │   │   │   ├── user/
│   │   │   │   │   ├── app-user.module.ts
│   │   │   │   │   ├── app-user.controller.ts
│   │   │   │   │   └── app-user.controller.spec.ts
│   │   │   │   ├── auth/
│   │   │   │   │   ├── app-auth.module.ts
│   │   │   │   │   ├── app-auth.controller.ts
│   │   │   │   │   └── guards/
│   │   │   │   └── ...
│   │   │   ├── app.module.ts      # Root module
│   │   │   └── main.ts            # Application entry point
│   │   ├── test/                  # E2E tests
│   │   └── Dockerfile
│   │
│   ├── admin/                     # Admin dashboard API
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── modules/
│   │   │   │   ├── user/
│   │   │   │   │   ├── admin-user.module.ts
│   │   │   │   │   └── admin-user.controller.ts
│   │   │   │   └── ...
│   │   │   ├── admin.module.ts
│   │   │   └── main.ts
│   │   └── test/
│   │
│   ├── customer/                  # Customer portal API
│   ├── background-processor/      # Background jobs & workers
│   └── ...
│
├── libs/                          # Shared libraries
│   │
│   ├── [module-name]/             # Example: user, product, order, contact
│   │   ├── src/
│   │   │   ├── entities/          # TypeORM entities
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── user.entity.spec.ts
│   │   │   │
│   │   │   ├── dtos/              # Data Transfer Objects
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   │
│   │   │   ├── services/          # Business logic (optional subfolder)
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.service.spec.ts
│   │   │   │
│   │   │   ├── repositories/      # Custom repositories (optional)
│   │   │   │   ├── user.repository.ts
│   │   │   │   └── user.repository.spec.ts
│   │   │   │
│   │   │   ├── events/            # Event handlers & emitters
│   │   │   │   ├── user-created.event.ts
│   │   │   │   └── user-created.handler.ts
│   │   │   │
│   │   │   ├── interfaces/        # TypeScript interfaces
│   │   │   │   └── user-repository.interface.ts
│   │   │   │
│   │   │   ├── constants/         # Module constants
│   │   │   │   └── user.constants.ts
│   │   │   │
│   │   │   ├── utils/             # Module-specific utilities
│   │   │   │   └── password-hasher.util.ts
│   │   │   │
│   │   │   ├── exceptions/        # Custom exceptions
│   │   │   │   └── user-not-found.exception.ts
│   │   │   │
│   │   │   ├── migrations/        # Module-specific migrations (optional)
│   │   │   │   └── 1234567890-create-user.ts
│   │   │   │
│   │   │   ├── [module].service.ts    # Main service (can be at root or in services/)
│   │   │   ├── [module].module.ts     # NestJS module definition
│   │   │   └── index.ts               # Public API exports
│   │   │
│   │   └── tsconfig.lib.json
│   │
│   ├── base-api/                  # Shared base classes & utilities
│   │   ├── src/
│   │   │   ├── base-entity.ts
│   │   │   ├── base-repository.ts
│   │   │   ├── base-service.ts
│   │   │   ├── pagination/
│   │   │   ├── scheduler/
│   │   │   └── ...
│   │
│   ├── common/                    # Cross-cutting concerns
│   │   ├── src/
│   │   │   ├── decorators/        # Custom decorators
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── guards/            # Authorization guards
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── interceptors/      # Request/Response interceptors
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── filters/           # Exception filters
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── pipes/             # Validation pipes
│   │   │   │   └── validation.pipe.ts
│   │   │   ├── middleware/        # Custom middleware
│   │   │   ├── utils/             # Shared utilities
│   │   │   ├── constants/         # Global constants
│   │   │   ├── interfaces/        # Shared interfaces
│   │   │   └── types/             # Shared types
│   │
│   └── ...
│
├── orm/                           # Database configuration
│   ├── config/
│   │   ├── ormconfig.ts
│   │   └── data-source.ts
│   ├── migrations/                # Global migrations
│   │   └── 1234567890-initial.ts
│   └── seeds/                     # Database seeds
│       └── user.seed.ts
│
├── scripts/                       # Build & deployment scripts
├── .github/                       # CI/CD workflows
├── docker-compose.yml
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

## Module Organization

### Library Module Structure (Recommended)

Each module in `libs/` should follow this structure:

```
libs/[module-name]/src/
├── entities/                      # TypeORM entities
│   ├── [entity].entity.ts
│   └── [entity].entity.spec.ts
│
├── dtos/                          # Data transfer objects
│   ├── create-[entity].dto.ts
│   ├── update-[entity].dto.ts
│   └── [entity]-response.dto.ts
│
├── services/                      # Business logic (optional subfolder)
│   ├── [module].service.ts
│   └── [module].service.spec.ts
│
├── repositories/                  # Custom repositories (optional)
│   ├── [entity].repository.ts
│   └── [entity].repository.spec.ts
│
├── events/                        # Event handlers
│   ├── [event-name].event.ts
│   └── [event-name].handler.ts
│
├── interfaces/                    # TypeScript interfaces
│   └── [interface-name].interface.ts
│
├── constants/                     # Module constants
│   └── [module].constants.ts
│
├── utils/                         # Module utilities
│   └── [utility-name].util.ts
│
├── exceptions/                    # Custom exceptions
│   └── [exception-name].exception.ts
│
├── migrations/                    # Module migrations (optional)
│   └── timestamp-migration-name.ts
│
├── [module].service.ts            # Main service (alternative to services/ folder)
├── [module].module.ts             # NestJS module
└── index.ts                       # Public exports
```

> **Note**: You can place the main service either at the root (`user.service.ts`) or in a `services/` subfolder. Choose one approach and be consistent across modules.

### Application Module Structure

Each application module in `apps/*/modules/` should be minimal and only contain presentation logic:

```
apps/app/src/modules/[module]/
├── [app]-[module].module.ts       # Imports lib module, registers controllers
├── [app]-[module].controller.ts   # HTTP endpoints
├── [app]-[module].controller.spec.ts
└── guards/                        # App-specific guards (if needed)
    └── [guard-name].guard.ts
```

---

## Dependency Flow

### Module Dependencies

```
Apps (Presentation)
  ↓ imports
Libs (Business Logic)
  ↓ uses
Database (TypeORM/PostgreSQL)
```

### Dependency Rules

✅ **Allowed**:

- Apps can import from Libs
- Libs can import from other Libs (with caution - avoid circular dependencies)
- Services can use Repositories
- Controllers can use Services

❌ **Forbidden**:

- Libs should NOT import from Apps
- Avoid circular dependencies between modules
- Controllers should NOT directly access Repositories (use Services instead)

### Dependency Injection Best Practice

Always use dependency injection with interfaces for better testability:

```typescript
// ❌ BAD: Direct dependency on concrete class
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}

// ✅ GOOD: Dependency on interface (when needed for flexibility)
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}
}

// ✅ ALSO GOOD: Direct injection when no abstraction needed
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}
```

### Module Communication

Modules should communicate via:

1. **Direct Service Calls** (for synchronous operations)
2. **Events** (for asynchronous, decoupled operations)

```typescript
// Direct service call
export class OrderService {
  constructor(private readonly userService: UserService) {}

  async createOrder(userId: string) {
    const user = await this.userService.findById(userId);
    // ... create order
  }
}

// Event-based communication
export class UserService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async create(dto: CreateUserDto) {
    const user = await this.repository.save(dto);
    this.eventEmitter.emit('user.created', { userId: user.id });
    return user;
  }
}

@Injectable()
export class EmailHandler {
  @OnEvent('user.created')
  async handleUserCreated(payload: { userId: string }) {
    // Send welcome email
  }
}
```

---

## Best Practices

### 1. **SOLID Principles**

#### Single Responsibility Principle (SRP)

- Each class should have one reason to change
- Controllers only handle HTTP concerns
- Services contain business logic
- Repositories handle data persistence

```typescript
// ❌ BAD: Controller doing too much
@Controller('users')
export class UserController {
  async createUser(@Body() dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.db.query('INSERT INTO users...');
    await this.emailService.send(user.email, 'Welcome!');
    return user;
  }
}

// ✅ GOOD: Thin controller, delegating to service
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
```

#### Open/Closed Principle (OCP)

- Open for extension, closed for modification
- Use interfaces and abstract classes

```typescript
// ✅ GOOD: Strategy pattern for payment processing
export interface IPaymentProcessor {
  process(amount: number): Promise<PaymentResult>;
}

export class StripePaymentProcessor implements IPaymentProcessor {
  async process(amount: number): Promise<PaymentResult> {
    /* ... */
  }
}

export class PayPalPaymentProcessor implements IPaymentProcessor {
  async process(amount: number): Promise<PaymentResult> {
    /* ... */
  }
}
```

#### Liskov Substitution Principle (LSP)

- Subtypes must be substitutable for their base types

#### Interface Segregation Principle (ISP)

- Clients shouldn't depend on interfaces they don't use

```typescript
// ❌ BAD: Fat interface
export interface IUserRepository {
  findById(id: string): Promise<User>;
  findAll(): Promise<User[]>;
  create(user: User): Promise<User>;
  sendEmail(email: string): Promise<void>; // Not repository concern!
}

// ✅ GOOD: Focused interfaces
export interface IUserRepository {
  findById(id: string): Promise<User>;
  findAll(): Promise<User[]>;
  create(user: User): Promise<User>;
}

export interface IEmailService {
  send(email: string, content: string): Promise<void>;
}
```

#### Dependency Inversion Principle (DIP)

- Depend on abstractions, not concretions

### 2. **Module Design**

#### Module Boundaries

- Each module should represent a **bounded context**
- Modules communicate via **events** or **service interfaces**
- Avoid circular dependencies

#### Module Exports

```typescript
// libs/user/src/index.ts - Public API
export { UserModule } from './user.module';
export { UserService } from './application/services/user.service';
export { CreateUserDto, UpdateUserDto } from './application/dtos';
export { User } from './domain/entities/user.entity';
export { IUserRepository } from './domain/interfaces/user-repository.interface';

// Don't export internal implementation details
// ❌ Don't export: repositories, internal utilities
```

### 3. **DTOs and Validation**

```typescript
// ✅ GOOD: Use class-validator for DTOs
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### 4. **Error Handling**

```typescript
// Domain exceptions
export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

// Usage in service
async findById(id: string): Promise<User> {
  const user = await this.userRepository.findById(id);
  if (!user) {
    throw new UserNotFoundException(id);
  }
  return user;
}
```

### 5. **Event-Driven Architecture**

```typescript
// Domain event
export class UserCreatedEvent {
  constructor(public readonly userId: string) {}
}

// Service emits event
async create(dto: CreateUserDto): Promise<User> {
  const user = await this.userRepository.create(dto);
  this.eventEmitter.emit('user.created', new UserCreatedEvent(user.id));
  return user;
}

// Event handler
@OnEvent('user.created')
async handleUserCreated(event: UserCreatedEvent) {
  await this.emailService.sendWelcomeEmail(event.userId);
}
```

### 6. **Configuration Management**

```typescript
// ✅ GOOD: Use ConfigService with validation
@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.getOrThrow<string>('DATABASE_URL');
  }
}
```

### 7. **Repository Pattern**

```typescript
// Domain interface
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

// Infrastructure implementation
@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(entity: UserEntity): User {
    // Map ORM entity to domain entity
  }
}
```

---

## Testing Strategy

### Unit Tests

- Test business logic in isolation
- Mock all dependencies
- Location: `*.spec.ts` next to source files

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;

    service = new UserService(repository);
  });

  it('should create a user', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    repository.save.mockResolvedValue({ id: '1', ...dto });

    const result = await service.create(dto);

    expect(result.id).toBe('1');
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(dto));
  });
});
```

### Integration Tests

- Test module interactions
- Use test database
- Location: `*.integration.spec.ts`

### E2E Tests

- Test complete user flows
- Location: `apps/*/test/`

```typescript
describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201);
  });
});
```

---

---

## Key Architectural Principles

1. **Separation of Concerns**: Controllers handle HTTP, services handle business logic, repositories handle data
2. **Modularity**: Features are isolated in separate modules
3. **Reusability**: Shared logic lives in `libs/` and can be used by multiple apps
4. **Testability**: Business logic is isolated and easily testable
5. **Scalability**: Monorepo allows code sharing while maintaining clear boundaries
6. **Maintainability**: Clear structure makes code easy to navigate and understand
7. **Type Safety**: TypeScript provides compile-time type checking

---

## Creating a New Module

When creating a new feature module:

1. **Create module folder** in `libs/[module-name]/src/`
2. **Create entities** in `libs/[module-name]/src/entities/`
3. **Create DTOs** in `libs/[module-name]/src/dtos/`
4. **Create service** in `libs/[module-name]/src/[module].service.ts`
5. **Create module** in `libs/[module-name]/src/[module].module.ts`
6. **Export public API** in `libs/[module-name]/src/index.ts`
7. **Add controllers** in `apps/[app]/src/modules/[module]/`
8. **Write tests** for entities, services, and controllers

### Example: Creating a "Product" Module

```bash
# 1. Create folder structure
mkdir -p libs/product/src/{entities,dtos,services}

# 2. Create entity
# libs/product/src/entities/product.entity.ts

# 3. Create DTOs
# libs/product/src/dtos/create-product.dto.ts
# libs/product/src/dtos/update-product.dto.ts

# 4. Create service
# libs/product/src/product.service.ts

# 5. Create module
# libs/product/src/product.module.ts

# 6. Create public API
# libs/product/src/index.ts

# 7. Add controller in app
# apps/app/src/modules/product/app-product.controller.ts
# apps/app/src/modules/product/app-product.module.ts
```

---

## ConfigModule

### Usage example in a service or controller:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';

@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}

  getAppInfo() {
    const appConfig = this.configService.get<AppConfig>('app');
    return {
      name: appConfig.name,
      environment: appConfig.env,
    };
  }
}
```

### Usage example in a main.ts:

```typescript
// Get config & app service
const configService = app.get(ConfigService);
const appConfig = configService.get<AppConfig>('app');

// Set global API prefix
app.setGlobalPrefix(`${appConfig?.apiPrefix}/${appConfig?.apiVersion}`);
```

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [NestJS Best Practices](https://docs.nestjs.com/fundamentals/testing)

```

```
